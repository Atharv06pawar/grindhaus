const { sendToEngine } = require("./bridgeService");
const { getSyncedProfile } = require("./profileService");

async function sendMessage(user, text) {
  const currentProfile = getSyncedProfile(user);

  if (!currentProfile) {
    throw new Error("Unable to sync profile before sending message.");
  }

  const response = await sendToEngine({
    userId: user.userId,
    text
  });

  const syncedProfile = getSyncedProfile(user);

  return {
    reply: response.reply,
    profile: syncedProfile
  };
}

module.exports = {
  sendMessage
};
