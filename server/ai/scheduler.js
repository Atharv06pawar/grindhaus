const { ensureMemoryStore } = require("./memoryService");
const { runHealthChecks } = require("./notificationEngine");

const DEFAULT_INTERVAL_MS = 60 * 1000;

let scheduler = null;

function startCompanionScheduler(options = {}) {
  if (scheduler) {
    return scheduler;
  }

  const intervalMs = Number(options.intervalMs) || DEFAULT_INTERVAL_MS;

  ensureMemoryStore();
  scheduler = setInterval(() => {
    try {
      runHealthChecks({
        reason: "interval"
      });
    } catch (error) {
      console.error("AI companion scheduler failed:", error.message);
    }
  }, intervalMs);

  if (typeof scheduler.unref === "function") {
    scheduler.unref();
  }

  return scheduler;
}

function stopCompanionScheduler() {
  if (!scheduler) {
    return;
  }

  clearInterval(scheduler);
  scheduler = null;
}

module.exports = {
  startCompanionScheduler,
  stopCompanionScheduler
};
