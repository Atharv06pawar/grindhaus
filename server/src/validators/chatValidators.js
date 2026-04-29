const { normalizeString } = require("../utils/sanitize");

function validateChatMessage(payload) {
  const text = normalizeString(payload.text);

  if (!text) {
    return { error: "text is required." };
  }

  if (text.length > 1000) {
    return { error: "text must be 1000 characters or fewer." };
  }

  return {
    value: {
      text
    }
  };
}

module.exports = {
  validateChatMessage
};
