const AppError = require("../utils/AppError");
const {
  createComment,
  createPost,
  getPosts,
  toggleLike
} = require("../services/communityService");

function listPosts(_req, res) {
  res.json(getPosts());
}

function postUpdate(req, res) {
  const post = createPost(req.user, req.body.content);
  res.status(201).json(post);
}

function likePost(req, res) {
  const post = toggleLike(req.params.postId, req.user);

  if (!post) {
    throw new AppError(404, "Post not found.");
  }

  res.json(post);
}

function commentPost(req, res) {
  const post = createComment(req.params.postId, req.user, req.body.content);

  if (!post) {
    throw new AppError(404, "Post not found.");
  }

  res.json(post);
}

module.exports = {
  listPosts,
  postUpdate,
  likePost,
  commentPost
};
