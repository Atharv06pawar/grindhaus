const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { text, media, type } = req.body;
  const post = await Post.create({ author: req.user._id, text, media, type });
  res.json(post);
};

exports.getFeed = async (req, res) => {
  // simple feed: latest posts
  const page = parseInt(req.query.page || 1);
  const per = 15;
  const posts = await Post.find().sort({ createdAt: -1 }).skip((page-1)*per).limit(per).populate('author','username avatarUrl');
  res.json(posts);
};

exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).send({message:'Not found'});
  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.json({ likes: post.likes.length });
};
