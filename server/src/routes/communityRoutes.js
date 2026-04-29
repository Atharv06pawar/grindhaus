const express = require("express");

const {
  commentPost,
  likePost,
  listPosts,
  postUpdate
} = require("../controllers/communityController");
const requireAuth = require("../middleware/requireAuth");
const { validateBody, validateParams } = require("../middleware/validate");
const {
  validateCommunityPost,
  validatePostIdParam
} = require("../validators/communityValidators");

const router = express.Router();

router.get("/posts", listPosts);
router.post("/posts", requireAuth, validateBody(validateCommunityPost), postUpdate);
router.post("/posts/:postId/like", requireAuth, validateParams(validatePostIdParam), likePost);
router.post(
  "/posts/:postId/comment",
  requireAuth,
  validateParams(validatePostIdParam),
  validateBody(validateCommunityPost),
  commentPost
);

module.exports = router;
