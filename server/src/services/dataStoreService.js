const { POSTS_FILE, PROFILES_FILE, USERS_FILE } = require("../config/paths");
const { ensureJsonFile, writeJsonFile } = require("../utils/fileStore");

function initializeDataStore() {
  ensureJsonFile(USERS_FILE, []);
  ensureJsonFile(PROFILES_FILE, []);
  ensureJsonFile(POSTS_FILE, []);
}

function readUsers() {
  return ensureJsonFile(USERS_FILE, []);
}

function writeUsers(users) {
  writeJsonFile(USERS_FILE, users);
}

function readProfiles() {
  return ensureJsonFile(PROFILES_FILE, []);
}

function writeProfiles(profiles) {
  writeJsonFile(PROFILES_FILE, profiles);
}

function readPosts() {
  return ensureJsonFile(POSTS_FILE, []);
}

function writePosts(posts) {
  writeJsonFile(POSTS_FILE, posts);
}

module.exports = {
  initializeDataStore,
  readUsers,
  writeUsers,
  readProfiles,
  writeProfiles,
  readPosts,
  writePosts
};
