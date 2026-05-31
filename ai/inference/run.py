from __future__ import annotations

import argparse
import sys
from pathlib import Path

import torch

AI_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = AI_DIR / "model"
sys.path.insert(0, str(MODEL_DIR))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import GPTConfig  # noqa: E402
from router import route  # noqa: E402
from transformer import GPTModel  # noqa: E402


TEMPERATURE = 0.7
TOP_P = 0.9
REPETITION_PENALTY = 1.2
MAX_NEW_TOKENS = 256
MAX_HISTORY_TURNS = 4


class ByteTokenizer:
    pad_token_id = 0
    bos_token_id = 1
    eos_token_id = 2
    byte_offset = 3
    vocab_size = 32000

    def encode(self, text: str, add_bos: bool = True, add_eos: bool = False) -> list[int]:
        tokens = [byte + self.byte_offset for byte in text.encode("utf-8")]
        if add_bos:
            tokens.insert(0, self.bos_token_id)
        if add_eos:
            tokens.append(self.eos_token_id)
        return tokens

    def decode(self, tokens: list[int]) -> str:
        values = [token - self.byte_offset for token in tokens if token >= self.byte_offset and token < 259]
        return bytes(values).decode("utf-8", errors="ignore")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the GrindHaus local GPT assistant.")
    parser.add_argument("--checkpoint", type=Path, default=AI_DIR / "inference" / "model" / "checkpoint_final.pt")
    parser.add_argument("--device", default="cuda" if torch.cuda.is_available() else "cpu")
    parser.add_argument("--max_new_tokens", type=int, default=MAX_NEW_TOKENS)
    parser.add_argument("--temperature", type=float, default=TEMPERATURE)
    parser.add_argument("--top_p", type=float, default=TOP_P)
    parser.add_argument("--repetition_penalty", type=float, default=REPETITION_PENALTY)
    return parser.parse_args()


def render_prompt(system_prompt: str, history: list[tuple[str, str, str]], user_input: str) -> str:
    parts = [f"<system>\n{system_prompt}"]

    for mode, user, assistant in history[-MAX_HISTORY_TURNS:]:
        parts.append(f"<user>\n[{mode.upper()}] {user}")
        parts.append(f"<assistant>\n{assistant}")

    parts.append(f"<user>\n{user_input}")
    parts.append("<assistant>\n")
    return "\n".join(parts)


def load_model(checkpoint_path: Path, device: torch.device) -> GPTModel:
    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}. Run ai/training/train.py first.")

    checkpoint = torch.load(checkpoint_path, map_location="cpu")
    config = GPTConfig.from_dict(checkpoint["config"])
    model = GPTModel(config)
    model.load_state_dict(checkpoint["model"], strict=True)
    model.to(device)
    model.eval()
    return model


def apply_repetition_penalty(logits: torch.Tensor, generated: list[int], penalty: float) -> torch.Tensor:
    if penalty == 1.0:
        return logits

    for token_id in set(generated):
        if token_id < logits.numel():
            logits[token_id] = logits[token_id] / penalty if logits[token_id] > 0 else logits[token_id] * penalty
    return logits


def top_p_sample(logits: torch.Tensor, temperature: float, top_p: float) -> int:
    logits = logits / max(temperature, 1e-5)
    sorted_logits, sorted_indices = torch.sort(logits, descending=True)
    probs = torch.softmax(sorted_logits, dim=-1)
    cumulative = torch.cumsum(probs, dim=-1)
    remove = cumulative > top_p
    remove[1:] = remove[:-1].clone()
    remove[0] = False
    sorted_logits[remove] = -float("inf")
    filtered_probs = torch.softmax(sorted_logits, dim=-1)
    sampled = torch.multinomial(filtered_probs, num_samples=1)
    return int(sorted_indices[sampled].item())


def clean_response(text: str) -> str:
    cleaned = text.strip()
    for marker in ("<system>", "<user>", "<assistant>"):
        if marker in cleaned:
            cleaned = cleaned.split(marker, 1)[0].strip()
    return " ".join(line.strip() for line in cleaned.splitlines() if line.strip())


@torch.inference_mode()
def generate(
    model: GPTModel,
    tokenizer: ByteTokenizer,
    prompt: str,
    device: torch.device,
    max_new_tokens: int,
    temperature: float,
    top_p: float,
    repetition_penalty: float,
) -> str:
    prompt_tokens = tokenizer.encode(prompt, add_bos=True, add_eos=False)
    prompt_tokens = prompt_tokens[-model.config.max_seq_len :]
    input_ids = torch.tensor([prompt_tokens], dtype=torch.long, device=device)
    output = model(input_ids, use_cache=True)
    kv_cache = output["kv_cache"]
    generated: list[int] = []
    next_logits = output["logits"][0, -1, :].float()

    for _ in range(max_new_tokens):
        next_logits = apply_repetition_penalty(next_logits.clone(), prompt_tokens + generated, repetition_penalty)
        token_id = top_p_sample(next_logits, temperature, top_p)

        if token_id == tokenizer.eos_token_id:
            break

        generated.append(token_id)
        token_tensor = torch.tensor([[token_id]], dtype=torch.long, device=device)
        output = model(token_tensor, kv_cache=kv_cache, use_cache=True)
        kv_cache = output["kv_cache"]
        next_logits = output["logits"][0, -1, :].float()

    return clean_response(tokenizer.decode(generated))


def main() -> None:
    args = parse_args()
    device = torch.device(args.device)
    tokenizer = ByteTokenizer()
    model = load_model(args.checkpoint, device)
    history: list[tuple[str, str, str]] = []

    print("GrindHaus local GPT assistant. Type 'exit' to quit.")

    while True:
        try:
            user_input = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not user_input:
            continue

        if user_input.lower() in {"exit", "quit", "/exit", "/quit"}:
            break

        mode, system_prompt = route(user_input)
        prompt = render_prompt(system_prompt, history, user_input)
        response = generate(
            model=model,
            tokenizer=tokenizer,
            prompt=prompt,
            device=device,
            max_new_tokens=args.max_new_tokens,
            temperature=args.temperature,
            top_p=args.top_p,
            repetition_penalty=args.repetition_penalty,
        )

        if not response:
            response = "Keep it simple. Say the next thing clearly."

        print(f"[{mode.upper()}] {response}")
        history.append((mode, user_input, response))
        history = history[-MAX_HISTORY_TURNS:]


if __name__ == "__main__":
    main()
