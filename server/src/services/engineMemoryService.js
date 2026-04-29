const fs = require("fs");
const path = require("path");

const { ENGINE_USERS_DIR } = require("../config/paths");

function sanitizeUserId(userId) {
  return (userId || "default-user").replace(/[^a-zA-Z0-9_-]/g, "_");
}

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function createDefaultMemory(seed = {}) {
  return {
    name: seed.name || seed.username || "",
    weight: Number(seed.weight) || 0,
    goal: seed.goal || "",
    streak: Number(seed.streak) || 0,
    last_activity: seed.lastActivity || "",
    history: Array.isArray(seed.history) ? seed.history : []
  };
}

function normalizeMemory(memory, seed = {}) {
  const normalized = createDefaultMemory(seed);

  if (!memory || typeof memory !== "object") {
    return normalized;
  }

  normalized.name = typeof memory.name === "string" ? memory.name : normalized.name;
  normalized.weight =
    typeof memory.weight === "number" && Number.isFinite(memory.weight)
      ? memory.weight
      : normalized.weight;
  normalized.goal = typeof memory.goal === "string" ? memory.goal : normalized.goal;
  normalized.streak = Number.isInteger(memory.streak) ? memory.streak : normalized.streak;
  normalized.last_activity =
    typeof memory.last_activity === "string" ? memory.last_activity : normalized.last_activity;
  normalized.history = Array.isArray(memory.history) ? memory.history : normalized.history;

  return normalized;
}

function getMemoryPath(userId) {
  ensureDirectory(ENGINE_USERS_DIR);
  return path.join(ENGINE_USERS_DIR, `${sanitizeUserId(userId)}.json`);
}

function readUserMemory(userId, seed = {}) {
  const filePath = getMemoryPath(userId);
  const defaultMemory = createDefaultMemory(seed);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultMemory, null, 2));
    return defaultMemory;
  }

  try {
    const rawValue = fs.readFileSync(filePath, "utf8").trim();

    if (!rawValue) {
      fs.writeFileSync(filePath, JSON.stringify(defaultMemory, null, 2));
      return defaultMemory;
    }

    const parsed = JSON.parse(rawValue);
    const normalized = normalizeMemory(parsed, seed);
    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2));
    return normalized;
  } catch (_error) {
    fs.writeFileSync(filePath, JSON.stringify(defaultMemory, null, 2));
    return defaultMemory;
  }
}

function ensureUserMemory(userId, seed = {}) {
  const filePath = getMemoryPath(userId);
  const defaultMemory = createDefaultMemory(seed);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultMemory, null, 2));
    return defaultMemory;
  }

  return readUserMemory(userId, seed);
}

function writeUserMemory(userId, memory) {
  const filePath = getMemoryPath(userId);
  const normalized = normalizeMemory(memory);
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2));
  return normalized;
}

function mergeProfileIntoMemory(memory, profile = {}) {
  const nextMemory = normalizeMemory(memory, profile);

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
  return {
    ...profile,
    name: memory.name || profile.name || profile.username || "",
    weight: Number(memory.weight) || 0,
    goal: memory.goal || profile.goal || "",
    streak: Number.isInteger(memory.streak) ? memory.streak : Number(profile.streak) || 0,
    lastActivity: memory.last_activity || profile.lastActivity || "",
    history: Array.isArray(memory.history) ? memory.history : []
  };
}

module.exports = {
  ensureUserMemory,
  readUserMemory,
  writeUserMemory,
  mergeProfileIntoMemory,
  mergeMemoryIntoProfile
};
