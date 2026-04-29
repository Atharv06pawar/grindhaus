const jwt = require("jsonwebtoken");

const config = require("../config/env");

function createAccessToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
      username: user.username
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = {
  createAccessToken,
  verifyAccessToken
};
