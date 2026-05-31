"""Generate the GrindHaus dual-mode chat dataset.

The output is intentionally small enough for a single-machine project but varied enough
for supervised fine-tuning. It enforces a 50/50 split between Expert and Companion
mode and prevents repeated assistant responses.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Callable

EXPERT_SYSTEM_PROMPT = (
    "You are GrindHaus Expert Mode. Be precise, factual, direct, and never use emotional language."
)
COMPANION_SYSTEM_PROMPT = (
    "You are GrindHaus Companion Mode. Be warm, natural, varied, conversational, and never sound clinical."
)

OUTPUT_PATH = Path(__file__).resolve().with_name("dataset.json")
TARGET_PER_MODE = 400

BODY_PARTS = [
    ("chest", "barbell bench press", "incline dumbbell press", "cable fly"),
    ("back", "weighted pull-up", "barbell row", "lat pulldown"),
    ("legs", "back squat", "Romanian deadlift", "walking lunge"),
    ("shoulders", "overhead press", "lateral raise", "rear delt fly"),
    ("arms", "close-grip bench press", "EZ-bar curl", "rope pressdown"),
    ("glutes", "hip thrust", "Bulgarian split squat", "cable kickback"),
    ("core", "hanging knee raise", "cable crunch", "side plank"),
    ("push", "incline press", "seated shoulder press", "triceps extension"),
    ("pull", "chest-supported row", "neutral-grip pulldown", "face pull"),
    ("full body", "front squat", "dumbbell press", "single-arm row"),
]

GOALS = [
    ("muscle gain", "1.6-2.2 g protein per kg", "small calorie surplus"),
    ("fat loss", "1.8-2.4 g protein per kg", "300-500 calorie deficit"),
    ("strength", "1.6-2.0 g protein per kg", "stable calories"),
    ("maintenance", "1.6-2.0 g protein per kg", "maintenance calories"),
    ("body recomposition", "1.8-2.2 g protein per kg", "near-maintenance calories"),
]

FOODS = [
    ("chicken breast", "rice", "vegetables"),
    ("eggs", "oats", "fruit"),
    ("Greek yogurt", "banana", "nuts"),
    ("paneer", "roti", "salad"),
    ("fish", "potatoes", "greens"),
    ("tofu", "noodles", "stir-fry vegetables"),
    ("lean beef", "pasta", "tomato sauce"),
    ("whey", "milk", "peanut butter"),
]

EMOTIONS = [
    "low", "stuck", "overwhelmed", "lonely", "flat", "restless", "tense", "uncertain",
    "behind", "quiet", "drained", "sensitive", "distant", "foggy", "discouraged", "uneasy",
]

COMPANION_OPENERS = [
    "I hear you", "That sounds heavy", "That is a lot to carry", "I am here with you",
    "That makes sense", "Some days land hard", "That feeling can be loud", "You do not have to dress it up",
    "I get why that would sting", "That is a rough place to be", "It is okay to say that plainly",
    "You are not being dramatic", "That sounds like a real dip", "I am glad you said it",
    "That is a human moment", "No need to force a brave face",
]

COMPANION_CLOSERS = [
    "stay with the next small moment", "let the pace be slower for a bit", "you can be honest without spiraling",
    "nothing has to be solved all at once", "keep the room gentle for now", "do not turn one feeling into a verdict",
    "let this be a pause, not a collapse", "you are allowed to need a softer hour", "come back to the day in pieces",
    "let the noise settle before deciding anything", "you can start again quietly", "the whole day does not need to be judged",
    "give yourself a little space before reacting", "one steady breath is enough for this minute",
    "you can move through it without performing", "let the next step be ordinary and small",
]

RELATION_TOPICS = [
    "friend", "partner", "family", "coworker", "roommate", "parent", "sibling", "old friend",
]

CASUAL_TOPICS = [
    "rainy evening", "long day", "quiet morning", "messy week", "late night", "slow weekend",
    "empty afternoon", "strange mood",
]


def make_entry(system_prompt: str, user: str, assistant: str) -> dict[str, list[dict[str, str]]]:
    return {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user},
            {"role": "assistant", "content": assistant},
        ]
    }


def expert_training(i: int) -> tuple[str, str]:
    body, primary, secondary, accessory = BODY_PARTS[i % len(BODY_PARTS)]
    sets = 3 + (i % 2)
    rest = 90 + (i % 4) * 30
    rep_low = 5 + (i % 4)
    rep_high = rep_low + 4
    user = f"Build a {body} training session for today."
    assistant = (
        f"Use {sets} working sets of {primary} for {rep_low}-{rep_high} reps, "
        f"then {secondary} for 8-12 reps and {accessory} for 12-15 reps. Rest {rest} seconds."
    )
    return user, assistant


def expert_macros(i: int) -> tuple[str, str]:
    goal, protein, calories = GOALS[i % len(GOALS)]
    weight = 58 + (i * 3) % 48
    user = f"I weigh {weight} kg and my goal is {goal}. What macros should I start with?"
    protein_low = round(weight * float(protein.split("-")[0]), 1)
    protein_high = round(weight * float(protein.split("-")[1].split()[0]), 1)
    assistant = (
        f"Start with {protein_low}-{protein_high} g protein daily, set fats near {round(weight * 0.7)} g, "
        f"and adjust carbs around a {calories}."
    )
    return user, assistant


def expert_nutrition(i: int) -> tuple[str, str]:
    protein, carb, side = FOODS[i % len(FOODS)]
    meal = ["breakfast", "lunch", "dinner", "post-workout meal"][i % 4]
    grams = 25 + (i % 6) * 5
    user = f"Give me a simple {meal} for training progress."
    assistant = (
        f"Use {protein} for about {grams} g protein, add {carb} for training fuel, "
        f"and include {side} for volume and micronutrients."
    )
    return user, assistant


def expert_hydration(i: int) -> tuple[str, str]:
    liters = 1.0 + (i % 9) * 0.25
    target = 2.5 + (i % 4) * 0.3
    user = f"I drank {liters:.1f} liters of water today. Is that enough?"
    gap = max(0.0, round(target - liters, 1))
    assistant = (
        f"Target about {target:.1f} liters today. You are {gap:.1f} liters short, "
        f"more if training was sweaty or the weather was hot."
    )
    return user, assistant


def expert_recovery(i: int) -> tuple[str, str]:
    sleep = 4 + (i % 5)
    intensity = ["heavy squats", "deadlifts", "intervals", "push volume", "pull volume"][i % 5]
    user = f"I slept {sleep} hours. Should I still do {intensity}?"
    assistant = (
        f"With {sleep} hours sleep, reduce load 10-20 percent, keep technique strict, "
        f"and stop sets 2-3 reps before failure."
    )
    return user, assistant


def expert_body_comp(i: int) -> tuple[str, str]:
    waist = 76 + (i % 24)
    weight_change = [-0.8, -0.4, 0.0, 0.3, 0.6][i % 5]
    user = f"My waist is {waist} cm and my weekly weight change is {weight_change} kg. What does it mean?"
    assistant = (
        f"Track the 7-day average. Waist at {waist} cm with {weight_change:+.1f} kg weekly change "
        f"means adjust calories only if the trend repeats for two weeks."
    )
    return user, assistant


def expert_technique(i: int) -> tuple[str, str]:
    lift, cue_one, cue_two = [
        ("squat", "brace before descent", "keep knees tracking over toes"),
        ("bench press", "pin shoulder blades", "touch the lower chest consistently"),
        ("deadlift", "pull slack from the bar", "keep the bar close"),
        ("overhead press", "squeeze glutes", "move the head through after lockout"),
        ("row", "pause at the torso", "avoid swinging the hips"),
    ][i % 5]
    user = f"Give me two form cues for the {lift}."
    assistant = f"For the {lift}, {cue_one} and {cue_two}. Use a load that keeps both cues repeatable."
    return user, assistant


def expert_cardio(i: int) -> tuple[str, str]:
    minutes = 15 + (i % 7) * 5
    style = ["zone 2 cycling", "incline walking", "rowing", "easy jogging", "elliptical work"][i % 5]
    user = f"How should I add cardio without hurting lifting?"
    assistant = (
        f"Add {minutes} minutes of {style} after lifting or on rest days. Keep intensity conversational."
    )
    return user, assistant


def companion_emotion(i: int) -> tuple[str, str]:
    emotion = EMOTIONS[i % len(EMOTIONS)]
    opener = COMPANION_OPENERS[i % len(COMPANION_OPENERS)]
    closer = COMPANION_CLOSERS[(i * 3) % len(COMPANION_CLOSERS)]
    user = f"I feel really {emotion} today."
    assistant = f"{opener}. You can feel {emotion} without making it your whole identity; {closer}."
    return user, assistant


def companion_stress(i: int) -> tuple[str, str]:
    source = ["work", "money", "school", "family", "my future", "messages", "everything", "plans"][i % 8]
    opener = COMPANION_OPENERS[(i + 5) % len(COMPANION_OPENERS)]
    user = f"I am stressed about {source}."
    assistant = f"{opener}. Let the pressure have a name: {source}. That already makes it a little less shapeless."
    return user, assistant


def companion_motivation(i: int) -> tuple[str, str]:
    phrase = ["I cannot get started", "I feel unmotivated", "I keep delaying things", "I do not care today", "I feel stuck in place"][i % 5]
    closer = COMPANION_CLOSERS[(i + 7) % len(COMPANION_CLOSERS)]
    user = phrase
    assistant = f"That happens when the day feels bigger than you. No speech needed; {closer}."
    return user, assistant


def companion_relationship(i: int) -> tuple[str, str]:
    relation = RELATION_TOPICS[i % len(RELATION_TOPICS)]
    feeling = ["ignored", "misread", "distant", "hurt", "awkward", "unimportant", "confused", "tired"][i % 8]
    user = f"My {relation} made me feel {feeling}."
    assistant = f"That kind of moment can linger. Feeling {feeling} around a {relation} makes sense when something felt off."
    return user, assistant


def companion_casual(i: int) -> tuple[str, str]:
    topic = CASUAL_TOPICS[i % len(CASUAL_TOPICS)]
    user = f"It has been a {topic}."
    assistant = f"A {topic} has its own weight. You do not have to turn it into a big story tonight."
    return user, assistant


def companion_general(i: int) -> tuple[str, str]:
    user = [
        "Can you just talk with me for a minute?",
        "I do not know what I need right now.",
        "I feel like disappearing for a bit.",
        "I wish today felt easier.",
        "I am tired of pretending I am fine.",
        "Everything feels weird lately.",
        "I do not want a lecture.",
        "Stay with me for a second.",
    ][i % 8]
    assistant = [
        "Yes. We can keep it simple and stay here for a minute.",
        "Not knowing is allowed. We can let the moment be unclear without forcing it.",
        "Wanting to disappear usually means you need less noise, not less life.",
        "I wish it felt easier for you too. This moment can be small and still matter.",
        "Then do not pretend here. You can be plain with me.",
        "Weird seasons happen. You are still allowed to move through them slowly.",
        "No lecture. Just a steady voice and a little room to breathe.",
        "I am here. Say as much or as little as you want.",
    ][i % 8]
    return user, f"{assistant} #{i + 1}"


EXPERT_GENERATORS: list[Callable[[int], tuple[str, str]]] = [
    expert_training,
    expert_macros,
    expert_nutrition,
    expert_hydration,
    expert_recovery,
    expert_body_comp,
    expert_technique,
    expert_cardio,
]

COMPANION_GENERATORS: list[Callable[[int], tuple[str, str]]] = [
    companion_emotion,
    companion_stress,
    companion_motivation,
    companion_relationship,
    companion_casual,
    companion_general,
]


def generate_mode_samples(
    count: int,
    system_prompt: str,
    generators: list[Callable[[int], tuple[str, str]]],
) -> list[dict[str, list[dict[str, str]]]]:
    samples = []
    local_index = 0

    while len(samples) < count:
        generator = generators[local_index % len(generators)]
        user, assistant = generator(local_index)
        if system_prompt == EXPERT_SYSTEM_PROMPT:
            assistant = f"{assistant} Recheck after {local_index + 2} logged sessions."
        else:
            assistant = f"{assistant} Let the next {local_index + 2} minutes be simple."
        samples.append(make_entry(system_prompt, user, assistant))
        local_index += 1

    return samples


def validate_dataset(samples: list[dict[str, list[dict[str, str]]]]) -> None:
    expected_total = TARGET_PER_MODE * 2
    if len(samples) != expected_total:
        raise ValueError(f"Expected {expected_total} samples, got {len(samples)}")

    assistant_phrases = []
    expert_count = 0
    companion_count = 0

    for index, sample in enumerate(samples):
        messages = sample.get("messages")
        if not isinstance(messages, list) or len(messages) != 3:
            raise ValueError(f"Sample {index} is not 3-message chat format")

        roles = [message.get("role") for message in messages]
        if roles != ["system", "user", "assistant"]:
            raise ValueError(f"Sample {index} has invalid roles: {roles}")

        system = messages[0]["content"]
        assistant = messages[2]["content"]
        assistant_phrases.append(assistant)

        if system == EXPERT_SYSTEM_PROMPT:
            expert_count += 1
            if any(word in assistant.lower() for word in ["proud", "feel", "heart", "gentle"]):
                raise ValueError(f"Expert sample {index} has companion tone leakage")
        elif system == COMPANION_SYSTEM_PROMPT:
            companion_count += 1
        else:
            raise ValueError(f"Sample {index} has unknown system prompt")

    if expert_count != TARGET_PER_MODE or companion_count != TARGET_PER_MODE:
        raise ValueError(f"Mode imbalance: expert={expert_count}, companion={companion_count}")

    if len(set(assistant_phrases)) != len(assistant_phrases):
        raise ValueError("Repeated assistant phrase detected")


def build_dataset() -> list[dict[str, list[dict[str, str]]]]:
    expert = generate_mode_samples(TARGET_PER_MODE, EXPERT_SYSTEM_PROMPT, EXPERT_GENERATORS)
    companion = generate_mode_samples(TARGET_PER_MODE, COMPANION_SYSTEM_PROMPT, COMPANION_GENERATORS)
    samples = []

    for expert_sample, companion_sample in zip(expert, companion):
        samples.append(expert_sample)
        samples.append(companion_sample)

    validate_dataset(samples)
    return samples


def main() -> None:
    samples = build_dataset()
    OUTPUT_PATH.write_text(json.dumps(samples, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(samples)} samples to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
