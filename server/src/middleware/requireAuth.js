const AppError = require("../utils/AppError");
const { findUserById } = require("../services/userService");
const { verifyAccessToken } = require("../utils/tokens");

function extractBearerToken(headerValue) {
  if (typeof headerValue !== "string") {
    return "";
  }

  const [scheme, token] = headerValue.split(" ");

  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token.trim();
}

function requireAuth(req, _res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    next(new AppError(401, "Authentication required."));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = findUserById(payload.userId);

    if (!user) {
      next(new AppError(401, "Session is no longer valid."));
      return;
    }

    req.auth = payload;
    req.user = user;
    next();
  } catch (_error) {
    next(new AppError(401, "Session expired. Please log in again."));
  }
}

module.exports = requireAuth;
