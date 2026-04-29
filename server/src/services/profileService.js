const { readProfiles, writeProfiles } = require("./dataStoreService");
const {
  ensureUserMemory,
  mergeMemoryIntoProfile,
  mergeProfileIntoMemory,
  writeUserMemory
} = require("./engineMemoryService");

function readProfileByUserId(userId) {
  return readProfiles().find((entry) => entry.userId === userId) || null;
}

function writeProfile(profile) {
  const profiles = readProfiles();
  const index = profiles.findIndex((entry) => entry.userId === profile.userId);

  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }

  writeProfiles(profiles);
  return profile;
}

function buildProfileRecord(user, existingProfile = null) {
  return {
    userId: user.userId,
    username: user.username,
    name: existingProfile?.name || user.username,
    weight: Number(existingProfile?.weight) || 0,
    goal: existingProfile?.goal || "",
    streak: Number(existingProfile?.streak) || 0,
    lastActivity: existingProfile?.lastActivity || "",
    createdAt: existingProfile?.createdAt || user.createdAt,
    history: Array.isArray(existingProfile?.history) ? existingProfile.history : []
  };
}

function getSyncedProfile(user) {
  const existingProfile = readProfileByUserId(user.userId) || buildProfileRecord(user);
  const engineMemory = ensureUserMemory(user.userId, existingProfile);
  const mergedProfile = mergeMemoryIntoProfile(existingProfile, engineMemory);

  const persistedProfile = {
    ...buildProfileRecord(user, mergedProfile),
    history: mergedProfile.history
  };

  writeProfile(persistedProfile);
  return persistedProfile;
}

function createInitialProfile(user) {
  const profile = buildProfileRecord(user, {
    name: user.username,
    createdAt: user.createdAt
  });

  writeProfile(profile);
  ensureUserMemory(user.userId, profile);
  return profile;
}

function updateProfile(user, payload) {
  const existingProfile = readProfileByUserId(user.userId) || buildProfileRecord(user);

  const nextProfile = {
    ...existingProfile,
    name: payload.name || user.username,
    goal: payload.goal,
    weight: payload.weight === null ? existingProfile.weight : payload.weight
  };

  const currentMemory = ensureUserMemory(user.userId, nextProfile);
  const mergedMemory = mergeProfileIntoMemory(currentMemory, nextProfile);
  writeUserMemory(user.userId, mergedMemory);

  const syncedProfile = mergeMemoryIntoProfile(nextProfile, mergedMemory);
  writeProfile(syncedProfile);

  return syncedProfile;
}

module.exports = {
  createInitialProfile,
  getSyncedProfile,
  updateProfile
};
