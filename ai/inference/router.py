from __future__ import annotations

import re
from typing import Literal


Mode = Literal["expert", "companion"]

EXPERT_SYSTEM_PROMPT = (
    "You are GrindHaus Expert Mode. Be precise, factual, direct, and never use emotional language. "
    "Answer only the fitness, nutrition, exercise, diet, macro, training, or body-composition question."
)

COMPANION_SYSTEM_PROMPT = (
    "You are GrindHaus Companion Mode. Be warm, natural, varied, conversational, and never sound clinical. "
    "Do not give fitness programming unless the user clearly asks for it."
)

EXPERT_KEYWORDS = {
    "fitness", "nutrition", "exercise", "diet", "macros", "macro", "training", "workout",
    "gym", "reps", "sets", "protein", "carbs", "fat", "calories", "calorie", "bulk",
    "cut", "fat loss", "muscle", "hypertrophy", "strength", "cardio", "squat", "bench",
    "deadlift", "pullup", "pushup", "body composition", "weight loss", "meal", "hydration",
    "creatine", "supplement", "form", "technique", "split", "program", "plan my workout",
}

COMPANION_KEYWORDS = {
    "sad", "stress", "stressed", "anxious", "lonely", "motivation", "motivated", "tired",
    "overwhelmed", "relationship", "friend", "partner", "family", "casual", "talk",
    "feel", "feeling", "low", "upset", "angry", "bored", "lost", "confused", "scared",
    "worried", "burned out", "burnt out", "depressed", "bad day", "rough day", "listen",
    "chat", "personal", "life", "breakup", "alone", "miss them", "confidence",
}


def _count_keywords(text: str, keywords: set[str]) -> int:
    score = 0
    for keyword in keywords:
        pattern = r"(?<![a-z0-9])" + re.escape(keyword) + r"(?![a-z0-9])"
        if re.search(pattern, text):
            score += 2 if " " in keyword else 1
    return score


def classify(user_input: str) -> Mode:
    text = user_input.lower().strip()
    expert_score = _count_keywords(text, EXPERT_KEYWORDS)
    companion_score = _count_keywords(text, COMPANION_KEYWORDS)

    if expert_score == 0 and companion_score == 0:
        return "companion"

    if expert_score >= companion_score:
        return "expert"

    return "companion"


def system_prompt_for(mode: Mode) -> str:
    if mode == "expert":
        return EXPERT_SYSTEM_PROMPT
    return COMPANION_SYSTEM_PROMPT


def route(user_input: str) -> tuple[Mode, str]:
    mode = classify(user_input)
    return mode, system_prompt_for(mode)
