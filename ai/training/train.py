from __future__ import annotations

import argparse
import json
import math
import sys
from itertools import cycle
from pathlib import Path

import torch
from torch.optim import AdamW
from torch.utils.data import DataLoader, Dataset

AI_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = AI_DIR / "model"
sys.path.insert(0, str(MODEL_DIR))

from config import GPTConfig  # noqa: E402
from transformer import GPTModel  # noqa: E402


PRECISION = "bf16"
GRADIENT_ACCUMULATION = 8
BATCH_SIZE = 2
LEARNING_RATE = 3e-4
WARMUP_STEPS = 100
MAX_STEPS = 2000


class ByteTokenizer:
    pad_token_id = 0
    bos_token_id = 1
    eos_token_id = 2
    byte_offset = 3
    vocab_size = 32000

    def encode(self, text: str, add_bos: bool = True, add_eos: bool = True) -> list[int]:
        tokens = [byte + self.byte_offset for byte in text.encode("utf-8")]
        if add_bos:
            tokens.insert(0, self.bos_token_id)
        if add_eos:
            tokens.append(self.eos_token_id)
        return tokens

    def decode(self, tokens: list[int]) -> str:
        values = [token - self.byte_offset for token in tokens if token >= self.byte_offset and token < 259]
        return bytes(values).decode("utf-8", errors="ignore")


def render_messages(messages: list[dict[str, str]]) -> str:
    rendered = []
    for message in messages:
        role = message["role"].strip().lower()
        content = message["content"].strip()
        rendered.append(f"<{role}>\n{content}")
    return "\n".join(rendered).strip()


class ChatDataset(Dataset):
    def __init__(self, dataset_path: Path, tokenizer: ByteTokenizer, max_seq_len: int):
        raw = json.loads(dataset_path.read_text(encoding="utf-8"))
        self.samples: list[list[int]] = []
        self.tokenizer = tokenizer
        self.max_seq_len = max_seq_len

        for item in raw:
            text = render_messages(item["messages"])
            tokens = tokenizer.encode(text)[:max_seq_len]
            if len(tokens) >= 3:
                self.samples.append(tokens)

        if not self.samples:
            raise ValueError("Dataset is empty after tokenization")

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int) -> list[int]:
        return self.samples[index]


def collate_batch(batch: list[list[int]], pad_token_id: int) -> tuple[torch.Tensor, torch.Tensor]:
    max_len = max(len(tokens) for tokens in batch)
    input_ids = torch.full((len(batch), max_len - 1), pad_token_id, dtype=torch.long)
    labels = torch.full((len(batch), max_len - 1), -100, dtype=torch.long)

    for row, tokens in enumerate(batch):
        source = torch.tensor(tokens[:-1], dtype=torch.long)
        target = torch.tensor(tokens[1:], dtype=torch.long)
        input_ids[row, : source.numel()] = source
        labels[row, : target.numel()] = target

    return input_ids, labels


def cosine_lr(step: int, max_steps: int, warmup_steps: int, base_lr: float) -> float:
    if step < warmup_steps:
        return base_lr * max(1, step) / warmup_steps
    progress = min(1.0, (step - warmup_steps) / max(1, max_steps - warmup_steps))
    return 0.5 * base_lr * (1.0 + math.cos(math.pi * progress))


def save_checkpoint(
    model: GPTModel,
    optimizer: AdamW,
    config: GPTConfig,
    step: int,
    checkpoint_dir: Path,
    final: bool = False,
) -> None:
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    filename = "checkpoint_final.pt" if final else f"checkpoint_step_{step}.pt"
    path = checkpoint_dir / filename
    torch.save(
        {
            "step": step,
            "config": config.to_dict(),
            "model": model.state_dict(),
            "optimizer": optimizer.state_dict(),
            "tokenizer": {
                "type": "byte",
                "pad_token_id": ByteTokenizer.pad_token_id,
                "bos_token_id": ByteTokenizer.bos_token_id,
                "eos_token_id": ByteTokenizer.eos_token_id,
                "byte_offset": ByteTokenizer.byte_offset,
                "vocab_size": ByteTokenizer.vocab_size,
            },
        },
        path,
    )
    print(f"saved checkpoint: {path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the local GrindHaus GPT model.")
    parser.add_argument("--dataset", type=Path, default=AI_DIR / "data" / "dataset.json")
    parser.add_argument("--output", type=Path, default=AI_DIR / "inference" / "model")
    parser.add_argument("--max_steps", type=int, default=MAX_STEPS)
    parser.add_argument("--warmup_steps", type=int, default=WARMUP_STEPS)
    parser.add_argument("--batch_size", type=int, default=BATCH_SIZE)
    parser.add_argument("--gradient_accumulation", type=int, default=GRADIENT_ACCUMULATION)
    parser.add_argument("--learning_rate", type=float, default=LEARNING_RATE)
    parser.add_argument("--max_seq_len", type=int, default=GPTConfig().max_seq_len)
    parser.add_argument("--num_workers", type=int, default=0)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    torch.manual_seed(args.seed)
    torch.set_float32_matmul_precision("high")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    if device.type != "cuda":
        raise RuntimeError("Training this model requires a CUDA GPU.")

    dtype = torch.bfloat16 if PRECISION == "bf16" else torch.float16
    config = GPTConfig(max_seq_len=args.max_seq_len)
    tokenizer = ByteTokenizer()
    dataset = ChatDataset(args.dataset, tokenizer, config.max_seq_len)
    loader = DataLoader(
        dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.num_workers,
        pin_memory=True,
        collate_fn=lambda batch: collate_batch(batch, tokenizer.pad_token_id),
    )

    model = GPTModel(config).to(device)
    model.enable_gradient_checkpointing()
    model.train()

    optimizer = AdamW(model.parameters(), lr=args.learning_rate, betas=(0.9, 0.95), weight_decay=0.1)
    data_iter = cycle(loader)
    optimizer.zero_grad(set_to_none=True)
    running_loss = 0.0

    for step in range(1, args.max_steps + 1):
        step_loss = 0.0
        lr = cosine_lr(step, args.max_steps, args.warmup_steps, args.learning_rate)
        for group in optimizer.param_groups:
            group["lr"] = lr

        for _ in range(args.gradient_accumulation):
            input_ids, labels = next(data_iter)
            input_ids = input_ids.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            with torch.autocast(device_type="cuda", dtype=dtype):
                output = model(input_ids, targets=labels)
                loss = output["loss"] / args.gradient_accumulation

            loss.backward()
            step_loss += float(loss.detach().cpu()) * args.gradient_accumulation

        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        optimizer.zero_grad(set_to_none=True)
        running_loss += step_loss

        if step % 10 == 0:
            print(f"step={step} loss={running_loss / 10:.4f} lr={lr:.6e}")
            running_loss = 0.0

        if step % 500 == 0:
            save_checkpoint(model, optimizer, config, step, args.output)

    save_checkpoint(model, optimizer, config, args.max_steps, args.output, final=True)


if __name__ == "__main__":
    main()
