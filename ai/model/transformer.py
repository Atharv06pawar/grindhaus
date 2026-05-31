from __future__ import annotations

import math
from typing import Optional

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.checkpoint import checkpoint

from config import GPTConfig


class RMSNorm(nn.Module):
    def __init__(self, hidden_size: int, eps: float = 1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(hidden_size))
        self.eps = eps

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        dtype = x.dtype
        x_float = x.float()
        variance = x_float.pow(2).mean(dim=-1, keepdim=True)
        x_norm = x_float * torch.rsqrt(variance + self.eps)
        return (self.weight * x_norm).to(dtype)


def rotate_half(x: torch.Tensor) -> torch.Tensor:
    x1 = x[..., : x.shape[-1] // 2]
    x2 = x[..., x.shape[-1] // 2 :]
    return torch.cat((-x2, x1), dim=-1)


class RotaryEmbedding(nn.Module):
    def __init__(self, dim: int, theta: float = 10000.0):
        super().__init__()
        inv_freq = 1.0 / (theta ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer("inv_freq", inv_freq, persistent=False)

    def forward(self, seq_len: int, device: torch.device, offset: int = 0) -> tuple[torch.Tensor, torch.Tensor]:
        positions = torch.arange(offset, offset + seq_len, device=device, dtype=self.inv_freq.dtype)
        freqs = torch.outer(positions, self.inv_freq.to(device))
        emb = torch.cat((freqs, freqs), dim=-1)
        cos = emb.cos()[None, None, :, :]
        sin = emb.sin()[None, None, :, :]
        return cos, sin


def apply_rotary(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    return (x * cos.to(dtype=x.dtype)) + (rotate_half(x) * sin.to(dtype=x.dtype))


class SwiGLU(nn.Module):
    def __init__(self, config: GPTConfig):
        super().__init__()
        self.gate_proj = nn.Linear(config.hidden_size, config.intermediate_size, bias=False)
        self.up_proj = nn.Linear(config.hidden_size, config.intermediate_size, bias=False)
        self.down_proj = nn.Linear(config.intermediate_size, config.hidden_size, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.down_proj(F.silu(self.gate_proj(x)) * self.up_proj(x))


class CausalSelfAttention(nn.Module):
    def __init__(self, config: GPTConfig):
        super().__init__()
        self.config = config
        self.num_heads = config.num_heads
        self.head_dim = config.head_dim
        self.q_proj = nn.Linear(config.hidden_size, config.hidden_size, bias=False)
        self.k_proj = nn.Linear(config.hidden_size, config.hidden_size, bias=False)
        self.v_proj = nn.Linear(config.hidden_size, config.hidden_size, bias=False)
        self.o_proj = nn.Linear(config.hidden_size, config.hidden_size, bias=False)
        self.rotary = RotaryEmbedding(config.head_dim, theta=config.rope_theta)
        self.dropout = nn.Dropout(config.dropout)

    def _shape(self, x: torch.Tensor) -> torch.Tensor:
        batch, seq_len, _ = x.shape
        return x.view(batch, seq_len, self.num_heads, self.head_dim).transpose(1, 2)

    def forward(
        self,
        x: torch.Tensor,
        kv_cache: Optional[tuple[torch.Tensor, torch.Tensor]] = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, Optional[tuple[torch.Tensor, torch.Tensor]]]:
        batch, seq_len, hidden_size = x.shape
        past_len = 0 if kv_cache is None else kv_cache[0].shape[2]
        total_len = past_len + seq_len

        if total_len > self.config.max_seq_len:
            raise ValueError(f"Sequence length {total_len} exceeds max_seq_len={self.config.max_seq_len}")

        q = self._shape(self.q_proj(x))
        k = self._shape(self.k_proj(x))
        v = self._shape(self.v_proj(x))
        cos, sin = self.rotary(seq_len, x.device, offset=past_len)
        q = apply_rotary(q, cos, sin)
        k = apply_rotary(k, cos, sin)

        if kv_cache is not None:
            k = torch.cat((kv_cache[0], k), dim=2)
            v = torch.cat((kv_cache[1], v), dim=2)

        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        query_positions = torch.arange(past_len, past_len + seq_len, device=x.device)[:, None]
        key_positions = torch.arange(total_len, device=x.device)[None, :]
        causal_mask = key_positions <= query_positions
        scores = scores.masked_fill(~causal_mask[None, None, :, :], torch.finfo(scores.dtype).min)
        probs = F.softmax(scores.float(), dim=-1).to(dtype=x.dtype)
        probs = self.dropout(probs)
        context = torch.matmul(probs, v)
        context = context.transpose(1, 2).contiguous().view(batch, seq_len, hidden_size)
        output = self.o_proj(context)
        next_cache = (k, v) if use_cache else None
        return output, next_cache


class TransformerBlock(nn.Module):
    def __init__(self, config: GPTConfig):
        super().__init__()
        self.input_norm = RMSNorm(config.hidden_size, eps=config.rms_norm_eps)
        self.attention = CausalSelfAttention(config)
        self.post_attention_norm = RMSNorm(config.hidden_size, eps=config.rms_norm_eps)
        self.mlp = SwiGLU(config)

    def forward(
        self,
        x: torch.Tensor,
        kv_cache: Optional[tuple[torch.Tensor, torch.Tensor]] = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, Optional[tuple[torch.Tensor, torch.Tensor]]]:
        attn_out, next_cache = self.attention(self.input_norm(x), kv_cache=kv_cache, use_cache=use_cache)
        x = x + attn_out
        x = x + self.mlp(self.post_attention_norm(x))
        return x, next_cache


class GPTModel(nn.Module):
    def __init__(self, config: GPTConfig):
        super().__init__()
        self.config = config
        self.token_embedding = nn.Embedding(config.vocab_size, config.hidden_size)
        self.blocks = nn.ModuleList([TransformerBlock(config) for _ in range(config.num_layers)])
        self.norm = RMSNorm(config.hidden_size, eps=config.rms_norm_eps)
        self.lm_head = nn.Linear(config.hidden_size, config.vocab_size, bias=False)
        self.lm_head.weight = self.token_embedding.weight
        self.gradient_checkpointing = False
        self.apply(self._init_weights)

    def _init_weights(self, module: nn.Module) -> None:
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)

    def enable_gradient_checkpointing(self) -> None:
        self.gradient_checkpointing = True

    def forward(
        self,
        input_ids: torch.Tensor,
        targets: Optional[torch.Tensor] = None,
        kv_cache: Optional[list[tuple[torch.Tensor, torch.Tensor]]] = None,
        use_cache: bool = False,
    ) -> dict[str, torch.Tensor | list[tuple[torch.Tensor, torch.Tensor]] | None]:
        if input_ids.ndim != 2:
            raise ValueError("input_ids must have shape [batch, seq_len]")

        if input_ids.shape[1] > self.config.max_seq_len:
            raise ValueError(f"Input length exceeds max_seq_len={self.config.max_seq_len}")

        x = self.token_embedding(input_ids)
        next_cache = [] if use_cache else None

        for layer_idx, block in enumerate(self.blocks):
            layer_cache = None if kv_cache is None else kv_cache[layer_idx]

            if self.gradient_checkpointing and self.training and not use_cache and layer_cache is None:
                x = checkpoint(lambda hidden: block(hidden, None, False)[0], x, use_reentrant=False)
            else:
                x, new_layer_cache = block(x, kv_cache=layer_cache, use_cache=use_cache)
                if use_cache:
                    next_cache.append(new_layer_cache)

        x = self.norm(x)
        logits = self.lm_head(x)
        loss = None

        if targets is not None:
            loss = F.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1),
                ignore_index=-100,
            )

        return {"logits": logits, "loss": loss, "kv_cache": next_cache}
