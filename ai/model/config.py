from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass
class GPTConfig:
    hidden_size: int = 1536
    num_layers: int = 20
    num_heads: int = 12
    intermediate_size: int = 4096
    vocab_size: int = 32000
    max_seq_len: int = 2048
    rms_norm_eps: float = 1e-6
    rope_theta: float = 10000.0
    dropout: float = 0.0
    pad_token_id: int = 0
    bos_token_id: int = 1
    eos_token_id: int = 2

    @property
    def head_dim(self) -> int:
        if self.hidden_size % self.num_heads != 0:
            raise ValueError("hidden_size must be divisible by num_heads")
        return self.hidden_size // self.num_heads

    def to_dict(self) -> dict[str, int | float]:
        return asdict(self)

    @classmethod
    def from_dict(cls, values: dict[str, int | float]) -> "GPTConfig":
        allowed = cls().__dict__.keys()
        return cls(**{key: value for key, value in values.items() if key in allowed})


def estimate_parameters(config: GPTConfig) -> int:
    embedding = config.vocab_size * config.hidden_size
    attention_per_layer = 4 * config.hidden_size * config.hidden_size
    mlp_per_layer = 3 * config.hidden_size * config.intermediate_size
    norms_per_layer = 2 * config.hidden_size
    final_norm = config.hidden_size
    return embedding + config.num_layers * (attention_per_layer + mlp_per_layer + norms_per_layer) + final_norm
