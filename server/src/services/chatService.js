const { generateCompanionResponse } = require("../../ai/aiEngine");
const { getUnreadNotifications, markNotificationsRead } = require("../../ai/notificationEngine");
const { getSyncedProfile } = require("./profileService");

async function sendMessage(user, text) {
  const currentProfile = getSyncedProfile(user);

  if (!currentProfile) {
    throw new Error("Unable to sync profile before sending message.");
  }

  const companionResult = generateCompanionResponse(user, text, currentProfile);
  const syncedProfile = getSyncedProfile(user);

  return {
    response: companionResult.response,
    reply: companionResult.response,
    intent: companionResult.intent,
    profile: syncedProfile,
    memory: companionResult.memory,
    notifications: companionResult.notifications
  };
}

function listNotifications(user) {
  return {
    notifications: getUnreadNotifications(user.userId)
  };
}

function markAllNotificationsRead(user) {
  const memory = markNotificationsRead(user.userId);

  return {
    notifications: memory.notifications.filter((notification) => !notification.read)
  };
}

module.exports = {
  listNotifications,
  markAllNotificationsRead,
  sendMessage
};
