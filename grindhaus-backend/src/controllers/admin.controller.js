const VideoVerification = require('../models/VideoVerification');

exports.listPending = async (req, res) => {
  const items = await VideoVerification.find({ status: 'pending' }).populate('user','username');
  res.json(items);
};

exports.review = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // approve / reject
  const item = await VideoVerification.findById(id);
  if (!item) return res.status(404).send({ message: 'Not found' });
  item.status = action === 'approve' ? 'approved' : 'rejected';
  item.reviewedBy = req.user._id;
  item.reviewedAt = new Date();
  await item.save();
  res.json(item);
};
