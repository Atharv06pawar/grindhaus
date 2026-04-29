const { normalizeString } = require("../utils/sanitize");

function validateCommunityPost(payload) {
  const content = normalizeString(payload.content);

  if (!content) {
    return { error: "content is required." };
  }

  if (content.length > 500) {
    return { error: "content must be 500 characters or fewer." };
  }

  return {
    value: {
      content
    }
  };
}

function validatePostIdParam(payload) {
  const postId = normalizeString(payload.postId);

  if (!postId) {
    return { error: "postId is required." };
  }

  return {
    value: { postId }
  };
}

module.exports = {
  validateCommunityPost,
  validatePostIdParam
};
