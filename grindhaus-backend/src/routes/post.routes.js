const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.get('/feed', postCtrl.getFeed);
router.post('/', authenticate, upload.array('media', 6), async (req, res) => {
  // media saved locally in uploads/, you would want to upload to S3 then return URLs
  const mediaUrls = (req.files || []).map(f => `/uploads/${f.filename}`);
  req.body.media = mediaUrls;
  req.body.type = req.body.type || 'post';
  return postCtrl.createPost(req, res);
});
router.post('/:id/like', authenticate, postCtrl.likePost);

module.exports = router;
