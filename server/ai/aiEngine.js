const {
  appendChatEntry,
  formatGoal,
  readMemory,
  toPublicMemory,
  updateMemory
} = require("./memoryService");
const { evaluateMemory, queueNotification } = require("./notificationEngine");
const { nowIso } = require("../src/utils/time");

function lower(value) {
  return String(value || "").toLowerCase();
}

function extractNumber(pattern, text) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : 0;
}

function extractGoal(text) {
  if (/(muscle|bulk|gain size|hypertrophy)/.test(text)) {
    return "muscle_gain";
  }

  if (/(fat loss|lose fat|lose weight|cut|lean down|weight loss)/.test(text)) {
    return "fat_loss";
  }

  if (/(strength|stronger|powerlifting|lift heavier)/.test(text)) {
    return "strength";
  }

  if (/(endurance|cardio|stamina|conditioning)/.test(text)) {
    return "endurance";
  }

  if (/(maintain|maintenance)/.test(text)) {
    return "maintenance";
  }

  return "";
}

function detectIntent(message) {
  const text = lower(message);
  const water =
    extractNumber(/(\d+(?:\.\d+)?)\s*(?:l|liter|liters|litre|litres)\b/, text) ||
    extractNumber(/(\d+(?:\.\d+)?)\s*ml\b/, text) / 1000;
  const protein = extractNumber(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams)\s*(?:of\s*)?protein\b/, text);
  const weight = extractNumber(/(?:weight|weigh|weighing|i am|i'm)\s*(?:is|=|:)?\s*(\d{2,3}(?:\.\d+)?)\s*(?:kg|kgs|kilograms|lb|lbs)?\b/, text);
  const sleepHours = extractNumber(/(\d+(?:\.\d+)?)\s*(?:hours|hrs|h)\s*(?:of\s*)?sleep\b/, text);
  const workoutTimeMatch = text.match(/(?:workout|train|training)\s*(?:time|at)?\s*(?:is|=|:|at)?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  const skippedWorkout = /(didn'?t|did not|missed|skipped).{0,30}(workout|train|gym|session)/.test(text);
  const completedWorkout = /(worked out|workout done|trained|hit the gym|finished.{0,20}workout|session done)/.test(text);
  const checkIn = /(check in|status|how am i|progress|summary|recap)/.test(text);
  const nutrition = /(ate|meal|calorie|calories|diet|nutrition|protein|carbs|fat\b)/.test(text);
  const hydration = /(water|hydrated|hydration|thirsty|dehydrated)/.test(text);
  const motivation = /(tired|lazy|unmotivated|motivat|give up|stuck|bad day|low energy)/.test(text);
  const goal = extractGoal(text);
  const preference = extractPreference(text);

  return {
    type: skippedWorkout
      ? "skipped_workout"
      : completedWorkout
      ? "completed_workout"
      : goal
      ? "goal_update"
      : weight
      ? "weight_update"
      : water
      ? "water_update"
      : protein
      ? "protein_update"
      : sleepHours
      ? "sleep_update"
      : workoutTimeMatch
      ? "workout_time_update"
      : checkIn
      ? "check_in"
      : nutrition
      ? "nutrition"
      : hydration
      ? "hydration"
      : motivation
      ? "motivation"
      : preference
      ? "preference"
      : "general",
    goal,
    water,
    protein,
    weight,
    sleepHours,
    workoutTime: workoutTimeMatch ? normalizeWorkoutTime(workoutTimeMatch) : "",
    preference
  };
}

function extractPreference(text) {
  const preferenceRules = [
    { pattern: /(home workout|train at home|workout at home)/, value: "prefers_home_workouts" },
    { pattern: /(gym|commercial gym|train at the gym)/, value: "prefers_gym_training" },
    { pattern: /(vegetarian|veg diet)/, value: "vegetarian" },
    { pattern: /(vegan)/, value: "vegan" },
    { pattern: /(knee pain|bad knee)/, value: "knee_sensitive" },
    { pattern: /(shoulder pain|bad shoulder)/, value: "shoulder_sensitive" }
  ];

  const rule = preferenceRules.find((entry) => entry.pattern.test(text));
  return rule ? rule.value : "";
}

function normalizeWorkoutTime(match) {
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const meridiem = match[3];

  if (meridiem === "pm" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return "";
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function applyIntent(memory, intent, user = {}) {
  const nextMemory = {
    ...memory,
    user: {
      ...memory.user,
      username: user.username || memory.user.username,
      name: memory.user.name || user.username || memory.user.username,
      habits: {
        ...memory.user.habits
      },
      preferences: [...memory.user.preferences]
    },
    metadata: {
      ...memory.metadata,
      lastInteractionAt: nowIso()
    }
  };

  if (intent.goal) {
    nextMemory.user.goal = intent.goal;
    nextMemory.metadata.lastGoalUpdateAt = nowIso();
  }

  if (intent.weight) {
    nextMemory.user.weight = intent.weight;
    nextMemory.user.habits.targetProtein = Math.round(intent.weight * 1.8);
  }

  if (intent.water) {
    nextMemory.user.habits.water = roundOne(intent.water);
  }

  if (intent.protein) {
    nextMemory.user.habits.protein = Math.round(intent.protein);
  }

  if (intent.sleepHours) {
    nextMemory.user.habits.sleepHours = roundOne(intent.sleepHours);
  }

  if (intent.workoutTime) {
    nextMemory.user.habits.workoutTime = intent.workoutTime;
  }

  if (intent.type === "completed_workout") {
    nextMemory.user.habits.workoutsCompleted += 1;
    nextMemory.user.habits.lastWorkoutAt = nowIso();
  }

  if (intent.type === "skipped_workout") {
    nextMemory.user.habits.missedWorkouts += 1;
  }

  if (intent.preference && !nextMemory.user.preferences.includes(intent.preference)) {
    nextMemory.user.preferences.push(intent.preference);
  }

  nextMemory.user.habits.lastCheckInAt = nowIso();

  return nextMemory;
}

function roundOne(value) {
  return Math.round(Number(value) * 10) / 10;
}

function buildResponse(memory, intent, message) {
  const { goal, habits, weight } = memory.user;
  const goalLabel = goal ? formatGoal(goal) : "your current goal";
  const waterGap = Math.max(0, roundOne(habits.targetWater - habits.water));
  const proteinGap = Math.max(0, Math.round(habits.targetProtein - habits.protein));
  const lastUserMessage = [...memory.chatHistory].reverse().find((entry) => entry.role === "user");
  const contextLine = lastUserMessage
    ? `I remember you last logged: "${lastUserMessage.text.slice(0, 80)}". `
    : "";

  if (intent.type === "goal_update") {
    return `Locked in: ${formatGoal(intent.goal)}. I will steer your reminders, nutrition nudges, and training advice around that from now on.`;
  }

  if (intent.type === "weight_update") {
    return `Logged your weight at ${weight} kg. For ${goalLabel}, I will use about ${habits.targetProtein}g protein as today's target.`;
  }

  if (intent.type === "water_update") {
    if (waterGap > 0) {
      return `Water logged at ${habits.water}L. You are still about ${waterGap}L under today's target, so keep a bottle close for the next block.`;
    }

    return `Hydration target cleared at ${habits.water}L. Nice work keeping the basics handled.`;
  }

  if (intent.type === "protein_update") {
    if (proteinGap > 0) {
      return `Protein logged at ${habits.protein}g. For ${goalLabel}, you are about ${proteinGap}g short, so make the next meal protein-led.`;
    }

    return `Protein target hit at ${habits.protein}g. That supports recovery and keeps tomorrow's training easier.`;
  }

  if (intent.type === "completed_workout") {
    return `Session logged. That is ${habits.workoutsCompleted} completed workout${habits.workoutsCompleted === 1 ? "" : "s"} in memory. Prioritize protein and sleep now so the work turns into progress.`;
  }

  if (intent.type === "skipped_workout") {
    return "That is okay, but consistency matters. Let's plan tomorrow: pick one focused session, keep it short, and restart the streak.";
  }

  if (intent.type === "sleep_update") {
    return `Logged ${habits.sleepHours} hours of sleep. If recovery feels low, keep training crisp today and avoid turning fatigue into sloppy volume.`;
  }

  if (intent.type === "workout_time_update") {
    return `Training reminder set around ${habits.workoutTime}. I will use that time for local workout nudges.`;
  }

  if (intent.type === "check_in") {
    return buildCheckIn(memory);
  }

  if (intent.type === "nutrition") {
    return `For ${goalLabel}, keep the next plate simple: protein first, carbs around training, and enough water to stay sharp. Current protein: ${habits.protein}g of ${habits.targetProtein}g.`;
  }

  if (intent.type === "hydration") {
    return waterGap > 0
      ? `Hydration is behind by about ${waterGap}L today. Drink now, then another glass with your next meal.`
      : "Hydration looks on track. Keep sipping steadily instead of trying to catch up all at once.";
  }

  if (intent.type === "motivation") {
    return `${contextLine}Low-energy days count too. Do the smallest honest version: 20 minutes, one main lift or walk, then report back.`;
  }

  if (intent.type === "preference") {
    return `Preference saved: ${intent.preference.replace(/_/g, " ")}. I will shape future suggestions around that.`;
  }

  if (/what should i do|plan|today/.test(lower(message))) {
    return `Today: train according to ${goalLabel}, get ${habits.targetProtein}g protein, reach ${habits.targetWater}L water, and check in after the session.`;
  }

  return `${contextLine}Logged. Based on ${goalLabel}, the next best move is simple: train consistently, hit protein, hydrate, and recover.`;
}

function buildCheckIn(memory) {
  const { goal, habits } = memory.user;
  const proteinGap = Math.max(0, Math.round(habits.targetProtein - habits.protein));
  const waterGap = Math.max(0, roundOne(habits.targetWater - habits.water));
  const goalLabel = goal ? formatGoal(goal) : "your goal";
  const parts = [
    `Check-in for ${goalLabel}:`,
    `${habits.workoutsCompleted} workouts completed in memory`,
    `${habits.protein}g/${habits.targetProtein}g protein`,
    `${habits.water}L/${habits.targetWater}L water`
  ];

  if (proteinGap > 0) {
    parts.push(`${proteinGap}g protein remaining`);
  }

  if (waterGap > 0) {
    parts.push(`${waterGap}L water remaining`);
  }

  return parts.join(". ") + ".";
}

function generateCompanionResponse(user, message, seed = {}) {
  const userId = user.userId || user.id || "default-user";
  const intent = detectIntent(message);
  const currentMemory = readMemory(userId, {
    ...seed,
    username: user.username
  });

  const updatedMemory = updateMemory(
    userId,
    (memory) => applyIntent(memory, intent, user),
    {
      ...seed,
      username: user.username
    }
  );
  const response = buildResponse(updatedMemory, intent, message);
  updateMemory(userId, (memory) => appendChatEntry(memory, "user", message, { intent: intent.type }));
  let finalMemory = updateMemory(userId, (memory) =>
    appendChatEntry(memory, "assistant", response, {
      intent: intent.type
    })
  );

  const triggeredNotifications = evaluateMemory(finalMemory, {
    reason: `chat:${intent.type}`
  });

  triggeredNotifications.forEach((notification) => {
    finalMemory = queueNotification(userId, notification);
  });

  return {
    response,
    intent: intent.type,
    memory: toPublicMemory(finalMemory),
    notifications: finalMemory.notifications.filter((notification) => !notification.read).slice(-10)
  };
}

module.exports = {
  detectIntent,
  generateCompanionResponse
};
