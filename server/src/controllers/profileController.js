const AppError = require("../utils/AppError");
const { getSyncedProfile, updateProfile } = require("../services/profileService");

function getProfile(req, res) {
  const profile = getSyncedProfile(req.user);

  if (!profile) {
    throw new AppError(404, "Profile not found.");
  }

  res.json(profile);
}

function patchProfile(req, res) {
  const profile = updateProfile(req.user, req.body);
  res.json(profile);
}

module.exports = {
  getProfile,
  patchProfile
};
