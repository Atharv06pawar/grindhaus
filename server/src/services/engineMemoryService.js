const { readMemory, updateMemory, writeMemory } = require("../../ai/memoryService");

function toLegacyMemory(memory) {
  const habits = memory.user.habits;

  return {
    name: memory.user.name || memory.user.username || "",
    weight: Number(memory.user.weight) || 0,
    goal: memory.user.goal || "",
    streak: Number(habits.workoutsCompleted) || 0,
    last_activity: memory.metadata.lastInteractionAt || habits.lastWorkoutAt || "",
    history: Array.isArray(memory.chatHistory) ? memory.chatHistory : []
  };
}

function normalizeLegacyMemory(memory = {}, seed = {}) {
  return {
    name: memory.name || seed.name || seed.username || "",
    weight: Number(memory.weight ?? seed.weight) || 0,
    goal: memory.goal || seed.goal || "",
    streak: Number(memory.streak ?? seed.streak) || 0,
    last_activity: memory.last_activity || seed.lastActivity || "",
    history: Array.isArray(memory.history) ? memory.history : Array.isArray(seed.history) ? seed.history : []
  };
}

function readUserMemory(userId, seed = {}) {
  return toLegacyMemory(readMemory(userId, seed));
}

function ensureUserMemory(userId, seed = {}) {
  return toLegacyMemory(readMemory(userId, seed));
}

function writeUserMemory(userId, memory) {
  const legacyMemory = normalizeLegacyMemory(memory);
  const nextMemory = updateMemory(userId, (currentMemory) => ({
    ...currentMemory,
    user: {
      ...currentMemory.user,
      name: legacyMemory.name || currentMemory.user.name,
      goal: legacyMemory.goal,
      weight: legacyMemory.weight,
      habits: {
        ...currentMemory.user.habits,
        workoutsCompleted: legacyMemory.streak,
        targetProtein: legacyMemory.weight
          ? Math.round(legacyMemory.weight * 1.8)
          : currentMemory.user.habits.targetProtein
      }
    },
    chatHistory: legacyMemory.history.slice(-120),
    metadata: {
      ...currentMemory.metadata,
      lastInteractionAt: legacyMemory.last_activity || currentMemory.metadata.lastInteractionAt
    }
  }));

  writeMemory(userId, nextMemory);
  return toLegacyMemory(nextMemory);
}

function mergeProfileIntoMemory(memory, profile = {}) {
  const nextMemory = normalizeLegacyMemory(memory, profile);

  if (typeof profile.name === "string" && profile.name.trim()) {
    nextMemory.name = profile.name.trim();
  }

  if (typeof profile.goal === "string") {
    nextMemory.goal = profile.goal.trim();
  }

  if (profile.weight !== undefined && profile.weight !== null && profile.weight !== "") {
    const numericWeight = Number(profile.weight);
    nextMemory.weight = Number.isFinite(numericWeight) ? numericWeight : nextMemory.weight;
  }

  if (profile.lastActivity) {
    nextMemory.last_activity = profile.lastActivity;
  }

  if (Number.isInteger(profile.streak)) {
    nextMemory.streak = profile.streak;
  }

  return nextMemory;
}

function mergeMemoryIntoProfile(profile = {}, memory = {}) {
  const legacyMemory = normalizeLegacyMemory(memory, profile);

  return {
    ...profile,
    name: legacyMemory.name || profile.name || profile.username || "",
    weight: Number(legacyMemory.weight) || 0,
    goal: legacyMemory.goal || profile.goal || "",
    streak: Number.isInteger(legacyMemory.streak) ? legacyMemory.streak : Number(profile.streak) || 0,
    lastActivity: legacyMemory.last_activity || profile.lastActivity || "",
    history: legacyMemory.history
  };
}

module.exports = {
  ensureUserMemory,
  readUserMemory,
  writeUserMemory,
  mergeProfileIntoMemory,
  mergeMemoryIntoProfile
};
