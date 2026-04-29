const { randomUUID } = require("crypto");

const { readPosts, writePosts } = require("./dataStoreService");
const { nowIso } = require("../utils/time");

function sortPosts(posts) {
  return [...posts].sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));
}

function getPosts() {
  return sortPosts(readPosts());
}

function createPost(user, content) {
  const posts = readPosts();

  const post = {
    postId: randomUUID(),
    userId: user.userId,
    username: user.username,
    content,
    timestamp: nowIso(),
    likes: 0,
    likedBy: [],
    comments: []
  };

  posts.unshift(post);
  writePosts(posts);

  return post;
}

function toggleLike(postId, user) {
  const posts = readPosts();
  const index = posts.findIndex((entry) => entry.postId === postId);

  if (index < 0) {
    return null;
  }

  const post = posts[index];
  const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
  const alreadyLiked = likedBy.includes(user.userId);

  const nextLikedBy = alreadyLiked
    ? likedBy.filter((entry) => entry !== user.userId)
    : [...likedBy, user.userId];

  const updatedPost = {
    ...post,
    likedBy: nextLikedBy,
    likes: nextLikedBy.length
  };

  posts[index] = updatedPost;
  writePosts(posts);

  return updatedPost;
}

function createComment(postId, user, content) {
  const posts = readPosts();
  const index = posts.findIndex((entry) => entry.postId === postId);

  if (index < 0) {
    return null;
  }

  const post = posts[index];
  const commentList = Array.isArray(post.comments) ? post.comments : [];

  const updatedPost = {
    ...post,
    comments: [
      ...commentList,
      {
        commentId: randomUUID(),
        userId: user.userId,
        username: user.username,
        content,
        timestamp: nowIso()
      }
    ]
  };

  posts[index] = updatedPost;
  writePosts(posts);

  return updatedPost;
}

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  createComment
};
