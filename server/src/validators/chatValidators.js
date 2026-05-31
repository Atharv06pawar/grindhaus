const { normalizeString } = require("../utils/sanitize");

function validateChatMessage(payload) {
  const text = normalizeString(payload.message || payload.text);

  if (!text) {
    return { error: "message is required." };
  }

  if (text.length > 1000) {
    return { error: "message must be 1000 characters or fewer." };
  }

  return {
    value: {
      message: text,
      text
    }
  };
}

module.exports = {
  validateChatMessage
};
