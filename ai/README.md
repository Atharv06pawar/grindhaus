# GrindHaus Local GPT System

Single-machine GPT-style Fitness + Companion AI system.

```text
ai/
├── data/
│   ├── dataset.json
│   └── generator.py
├── model/
│   ├── config.py
│   └── transformer.py
├── training/
│   └── train.py
├── inference/
│   ├── router.py
│   └── run.py
└── README.md
```

`engine_cpp/` may still exist in this repository for the older deterministic engine. The GPT pipeline above is self-contained.

## Modes

Expert Mode:
- Triggered by fitness, nutrition, exercise, diet, macros, body composition, and training.
- Tone is precise, factual, and direct.

Companion Mode:
- Triggered by emotion, stress, motivation, relationships, casual chat, and personal topics.
- Tone is warm, natural, conversational, and non-clinical.

Routing is implemented in `inference/router.py`.

## Dataset

Generate the dataset:

```powershell
python ai/data/generator.py
```

Output:

```text
ai/data/dataset.json
```

The generated dataset contains 800 chat-format samples:
- 400 Expert Mode samples
- 400 Companion Mode samples
- no repeated assistant responses

## Model

Architecture:

```text
hidden_size       = 1536
num_layers        = 20
num_heads         = 12
intermediate_size = 4096
vocab_size        = 32000
max_seq_len       = 2048
```

Implemented:
- RoPE positional embeddings
- RMSNorm
- SwiGLU
- causal self-attention
- KV cache for inference
- tied input/output embeddings

## Training

Single GPU PyTorch training:

```powershell
python ai/training/train.py
```

Defaults:

```text
precision             = bf16
gradient_accumulation = 8
batch_size            = 2
learning_rate         = 3e-4
warmup_steps          = 100
max_steps             = 2000
```

Checkpoints:

```text
ai/inference/model/checkpoint_step_500.pt
ai/inference/model/checkpoint_step_1000.pt
ai/inference/model/checkpoint_step_1500.pt
ai/inference/model/checkpoint_step_2000.pt
ai/inference/model/checkpoint_final.pt
```

## Inference

After training:

```powershell
python ai/inference/run.py
```

Generation:

```text
temperature        = 0.7
top_p              = 0.9
repetition_penalty = 1.2
max_new_tokens     = 256
```

CLI output includes the active mode:

```text
you> how many grams of protein should I eat?
[EXPERT] Start with 1.6-2.2 g protein per kg body weight and adjust based on progress.

you> I feel low today
[COMPANION] I hear you. You do not have to turn one hard day into a verdict.
```
