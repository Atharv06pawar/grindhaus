const Progress = require('../models/Progress');

exports.addProgress = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.user._id;
    const p = await Progress.create(data);
    res.json(p);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

exports.getProgress = async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const items = await Progress.find({ user: userId }).sort({ date: -1 }).limit(100);
  res.json(items);
};
