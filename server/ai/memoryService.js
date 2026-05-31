const path = require("path");

const { ensureJsonFile, writeJsonFile } = require("../src/utils/fileStore");
const { nowIso } = require("../src/utils/time");

const MEMORY_FILE = process.env.AI_MEMORY_FILE || path.join(__dirname, "memory.json");
const MAX_HISTORY_ITEMS = 120;
const MAX_NOTIFICATIONS = 60;

const DEFAULT_STORE = {
  version: 1,
  users: {},
  system: {
    lastSchedulerRunAt: ""
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeGoal(goal = "") {
  const value = String(goal).trim().toLowerCase();

  if (!value) {
    return "";
  }

  if (/(muscle|bulk|gain|hypertrophy)/.test(value)) {
    return "muscle_gain";
  }

  if (/(fat|cut|lean|lose|loss|weight loss)/.test(value)) {
    return "fat_loss";
  }

  if (/(strength|power|lift)/.test(value)) {
    return "strength";
  }

  if (/(endurance|cardio|stamina|conditioning)/.test(value)) {
    return "endurance";
  }

  if (/(maintain|maintenance)/.test(value)) {
    return "maintenance";
  }

  return value.replace(/\s+/g, "_");
}

function formatGoal(goal = "") {
  return String(goal || "").replace(/_/g, " ");
}

function createDefaultUserMemory(userId, seed = {}) {
  const weight = Number(seed.weight) || 0;
  const goal = normalizeGoal(seed.goal);

  return {
    userId,
    user: {
      username: seed.username || seed.name || "",
      name: seed.name || seed.username || "",
      goal,
      weight,
      habits: {
        water: 0,
        protein: 0,
        sleepHours: 0,
        workoutsCompleted: 0,
        missedWorkouts: 0,
        workoutTime: "18:00",
        lastWorkoutAt: "",
        lastCheckInAt: "",
        targetWater: 3,
        targetProtein: weight > 0 ? Math.round(weight * 1.8) : 140
      },
      preferences: []
    },
    chatHistory: Array.isArray(seed.history) ? seed.history.slice(-MAX_HISTORY_ITEMS) : [],
    insights: [],
    notifications: [],
    metadata: {
      createdAt: seed.createdAt || nowIso(),
      lastInteractionAt: "",
      lastSchedulerRunAt: "",
      lastGoalUpdateAt: ""
    }
  };
}

function normalizeUserMemory(userId, memory = {}, seed = {}) {
  const fallback = createDefaultUserMemory(userId, seed);
  const incomingUser = memory.user && typeof memory.user === "object" ? memory.user : {};
  const incomingHabits =
    incomingUser.habits && typeof incomingUser.habits === "object" ? incomingUser.habits : {};
  const weight = Number(incomingUser.weight ?? fallback.user.weight) || 0;
  const targetProtein =
    Number(incomingHabits.targetProtein) ||
    Number(fallback.user.habits.targetProtein) ||
    (weight > 0 ? Math.round(weight * 1.8) : 140);

  return {
    userId,
    user: {
      username: incomingUser.username || fallback.user.username,
      name: incomingUser.name || fallback.user.name,
      goal: normalizeGoal(incomingUser.goal || fallback.user.goal),
      weight,
      habits: {
        water: Number(incomingHabits.water) || 0,
        protein: Number(incomingHabits.protein) || 0,
        sleepHours: Number(incomingHabits.sleepHours) || 0,
        workoutsCompleted: Number(incomingHabits.workoutsCompleted) || 0,
        missedWorkouts: Number(incomingHabits.missedWorkouts) || 0,
        workoutTime: incomingHabits.workoutTime || fallback.user.habits.workoutTime,
        lastWorkoutAt: incomingHabits.lastWorkoutAt || "",
        lastCheckInAt: incomingHabits.lastCheckInAt || "",
        targetWater: Number(incomingHabits.targetWater) || fallback.user.habits.targetWater,
        targetProtein
      },
      preferences: Array.isArray(incomingUser.preferences) ? incomingUser.preferences.slice(0, 30) : []
    },
    chatHistory: Array.isArray(memory.chatHistory)
      ? memory.chatHistory.slice(-MAX_HISTORY_ITEMS)
      : fallback.chatHistory,
    insights: Array.isArray(memory.insights) ? memory.insights.slice(-50) : [],
    notifications: Array.isArray(memory.notifications)
      ? memory.notifications.slice(-MAX_NOTIFICATIONS)
      : [],
    metadata: {
      ...fallback.metadata,
      ...(memory.metadata && typeof memory.metadata === "object" ? memory.metadata : {})
    }
  };
}

function readStore() {
  const store = ensureJsonFile(MEMORY_FILE, DEFAULT_STORE);
  const users = store.users && typeof store.users === "object" ? store.users : {};

  return {
    version: 1,
    users,
    system: store.system && typeof store.system === "object" ? store.system : { ...DEFAULT_STORE.system }
  };
}

function writeStore(store) {
  writeJsonFile(MEMORY_FILE, {
    version: 1,
    users: store.users || {},
    system: store.system || { ...DEFAULT_STORE.system }
  });
}

function ensureMemoryStore() {
  const store = readStore();
  writeStore(store);
  return store;
}

function readMemory(userId, seed = {}) {
  const store = readStore();
  const safeUserId = userId || "default-user";
  const memory = normalizeUserMemory(safeUserId, store.users[safeUserId], seed);

  if (!store.users[safeUserId]) {
    store.users[safeUserId] = memory;
    writeStore(store);
  }

  return memory;
}

function writeMemory(userId, memory) {
  const store = readStore();
  const safeUserId = userId || "default-user";
  const normalized = normalizeUserMemory(safeUserId, memory);

  store.users[safeUserId] = normalized;
  writeStore(store);

  return normalized;
}

function updateMemory(userId, updater, seed = {}) {
  const store = readStore();
  const safeUserId = userId || "default-user";
  const currentMemory = normalizeUserMemory(safeUserId, store.users[safeUserId], seed);
  const nextMemory = normalizeUserMemory(
    safeUserId,
    typeof updater === "function" ? updater(clone(currentMemory)) : updater,
    seed
  );

  store.users[safeUserId] = nextMemory;
  writeStore(store);

  return nextMemory;
}

function appendChatEntry(memory, role, text, metadata = {}) {
  const nextHistory = [
    ...memory.chatHistory,
    {
      role,
      text,
      timestamp: metadata.timestamp || nowIso(),
      intent: metadata.intent || ""
    }
  ];

  return {
    ...memory,
    chatHistory: nextHistory.slice(-MAX_HISTORY_ITEMS)
  };
}

function appendNotification(memory, notification) {
  const nextNotifications = [
    ...memory.notifications,
    {
      id: notification.id || `${notification.type || "notice"}-${Date.now()}`,
      type: notification.type || "general",
      message: notification.message,
      severity: notification.severity || "info",
      createdAt: notification.createdAt || nowIso(),
      read: false
    }
  ];

  return {
    ...memory,
    notifications: nextNotifications.slice(-MAX_NOTIFICATIONS)
  };
}

function listUserMemories() {
  const store = readStore();

  return Object.keys(store.users).map((userId) => normalizeUserMemory(userId, store.users[userId]));
}

function writeSystemMetadata(metadata) {
  const store = readStore();

  store.system = {
    ...store.system,
    ...metadata
  };

  writeStore(store);
  return store.system;
}

function toPublicMemory(memory) {
  return {
    user: {
      goal: memory.user.goal,
      goalLabel: formatGoal(memory.user.goal),
      weight: memory.user.weight,
      habits: memory.user.habits,
      preferences: memory.user.preferences
    },
    chatHistory: memory.chatHistory.slice(-20),
    notifications: memory.notifications.filter((notification) => !notification.read).slice(-10),
    insights: memory.insights.slice(-10),
    metadata: memory.metadata
  };
}

module.exports = {
  appendChatEntry,
  appendNotification,
  ensureMemoryStore,
  formatGoal,
  normalizeGoal,
  readMemory,
  listUserMemories,
  toPublicMemory,
  updateMemory,
  writeMemory,
  writeSystemMetadata
};
