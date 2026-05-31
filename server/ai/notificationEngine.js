const {
  appendNotification,
  listUserMemories,
  readMemory,
  updateMemory,
  writeSystemMetadata
} = require("./memoryService");
const { nowIso } = require("../src/utils/time");

const COOLDOWN_MS = {
  hydration: 2 * 60 * 60 * 1000,
  nutrition: 4 * 60 * 60 * 1000,
  workout: 6 * 60 * 60 * 1000,
  inactivity: 8 * 60 * 60 * 1000,
  performance: 12 * 60 * 60 * 1000
};

function hoursSince(timestamp, now = new Date()) {
  if (!timestamp) {
    return Infinity;
  }

  const then = new Date(timestamp);

  if (Number.isNaN(then.getTime())) {
    return Infinity;
  }

  return (now.getTime() - then.getTime()) / (60 * 60 * 1000);
}

function wasCreatedToday(timestamp, now = new Date()) {
  if (!timestamp) {
    return false;
  }

  const date = new Date(timestamp);

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isAfterWorkoutTime(workoutTime, now = new Date()) {
  const [hour, minute] = String(workoutTime || "18:00")
    .split(":")
    .map((part) => Number(part));

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return false;
  }

  const scheduled = new Date(now);
  scheduled.setHours(hour, minute, 0, 0);

  return now >= scheduled;
}

function hasRecentNotification(memory, type, now = new Date()) {
  const cooldown = COOLDOWN_MS[type] || COOLDOWN_MS.performance;

  return [...memory.notifications].reverse().some((notification) => {
    if (notification.type !== type) {
      return false;
    }

    const createdAt = new Date(notification.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      return false;
    }

    return now.getTime() - createdAt.getTime() < cooldown;
  });
}

function buildNotification(type, message, severity = "info") {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    severity,
    createdAt: nowIso()
  };
}

function evaluateMemory(memory, options = {}) {
  const now = options.now || new Date();
  const notifications = [];
  const { habits } = memory.user;
  const waterGap = Math.max(0, Math.round((habits.targetWater - habits.water) * 10) / 10);
  const proteinGap = Math.max(0, Math.round(habits.targetProtein - habits.protein));
  const inactiveHours = hoursSince(memory.metadata.lastInteractionAt, now);

  if (waterGap >= 0.7 && !hasRecentNotification(memory, "hydration", now)) {
    notifications.push(
      buildNotification(
        "hydration",
        `Hydration check: you are about ${waterGap}L under today's target. Drink water now.`,
        "nudge"
      )
    );
  }

  if (now.getHours() >= 17 && proteinGap >= 25 && !hasRecentNotification(memory, "nutrition", now)) {
    notifications.push(
      buildNotification(
        "nutrition",
        `Protein is behind by about ${proteinGap}g. Make the next meal protein-led.`,
        "nudge"
      )
    );
  }

  if (
    isAfterWorkoutTime(habits.workoutTime, now) &&
    !wasCreatedToday(habits.lastWorkoutAt, now) &&
    !hasRecentNotification(memory, "workout", now)
  ) {
    notifications.push(
      buildNotification(
        "workout",
        "Training window is here. If time is tight, do the shortest honest session.",
        "action"
      )
    );
  }

  if (inactiveHours >= 12 && !hasRecentNotification(memory, "inactivity", now)) {
    notifications.push(
      buildNotification(
        "inactivity",
        "Quick check-in: log water, protein, or training so I can keep your plan accurate.",
        "info"
      )
    );
  }

  if (
    habits.missedWorkouts > 0 &&
    habits.workoutsCompleted > 0 &&
    habits.missedWorkouts >= habits.workoutsCompleted &&
    !hasRecentNotification(memory, "performance", now)
  ) {
    notifications.push(
      buildNotification(
        "performance",
        "Pattern spotted: missed sessions are catching completed ones. Plan tomorrow before bed.",
        "insight"
      )
    );
  }

  return notifications;
}

function queueNotification(userId, notification) {
  return updateMemory(userId, (memory) => appendNotification(memory, notification));
}

function getUnreadNotifications(userId) {
  return readMemory(userId).notifications.filter((notification) => !notification.read);
}

function markNotificationsRead(userId) {
  return updateMemory(userId, (memory) => ({
    ...memory,
    notifications: memory.notifications.map((notification) => ({
      ...notification,
      read: true
    }))
  }));
}

function runHealthChecks(options = {}) {
  const now = options.now || new Date();
  const results = [];

  listUserMemories().forEach((memory) => {
    const notifications = evaluateMemory(memory, {
      now,
      reason: options.reason || "scheduler"
    });

    notifications.forEach((notification) => {
      const updatedMemory = queueNotification(memory.userId, notification);
      results.push({
        userId: memory.userId,
        notification,
        unreadCount: updatedMemory.notifications.filter((entry) => !entry.read).length
      });
    });
  });

  writeSystemMetadata({
    lastSchedulerRunAt: nowIso()
  });

  return results;
}

module.exports = {
  evaluateMemory,
  getUnreadNotifications,
  markNotificationsRead,
  queueNotification,
  runHealthChecks
};
