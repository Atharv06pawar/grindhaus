const AppError = require("../utils/AppError");
const {
  authenticateUser,
  createUser,
  findUserByUsername,
  toPublicUser
} = require("../services/userService");
const { createInitialProfile, getSyncedProfile } = require("../services/profileService");
const { createAccessToken } = require("../utils/tokens");

function buildAuthResponse(user, profile) {
  return {
    token: createAccessToken(user),
    user: toPublicUser(user),
    profile
  };
}

async function signup(req, res) {
  const { username, password } = req.body;

  if (findUserByUsername(username)) {
    throw new AppError(409, "Username already exists.");
  }

  const user = createUser({ username, password });
  const profile = createInitialProfile(user);

  res.status(201).json(buildAuthResponse(user, profile));
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = authenticateUser({ username, password });

  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  const profile = getSyncedProfile(user);

  res.json(buildAuthResponse(user, profile));
}

async function getCurrentSession(req, res) {
  const profile = getSyncedProfile(req.user);

  res.json({
    user: toPublicUser(req.user),
    profile
  });
}

module.exports = {
  getCurrentSession,
  signup,
  login
};
