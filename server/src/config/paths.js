const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..", "..", "..");
const SERVER_ROOT = path.join(PROJECT_ROOT, "server");
const DATA_DIR = path.join(SERVER_ROOT, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PROFILES_FILE = path.join(DATA_DIR, "profiles.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

const ENGINE_DIRECTORY = path.join(PROJECT_ROOT, "ai", "engine_cpp");
const ENGINE_BINARY_NAME = process.platform === "win32" ? "grind_engine.exe" : "grind_engine";
const ENGINE_PATH = path.join(ENGINE_DIRECTORY, ENGINE_BINARY_NAME);
const ENGINE_USERS_DIR = path.join(ENGINE_DIRECTORY, "users");

module.exports = {
  PROJECT_ROOT,
  SERVER_ROOT,
  DATA_DIR,
  USERS_FILE,
  PROFILES_FILE,
  POSTS_FILE,
  ENGINE_DIRECTORY,
  ENGINE_PATH,
  ENGINE_USERS_DIR
};
