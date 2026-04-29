const { normalizeString } = require("../utils/sanitize");

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,24}$/;

function validateCredentials(payload) {
  const username = normalizeString(payload.username);
  const password = typeof payload.password === "string" ? payload.password.trim() : "";

  if (!username || !password) {
    return { error: "username and password are required." };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return {
      error:
        "username must be 3-24 characters and only include letters, numbers, underscores, or hyphens."
    };
  }

  if (password.length < 8 || password.length > 72) {
    return { error: "password must be between 8 and 72 characters." };
  }

  return {
    value: {
      username,
      password
    }
  };
}

module.exports = {
  validateCredentials
};
