const Food = require('../models/Food');

exports.createFood = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user._id;
    const food = await Food.create(data);
    res.json(food);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q || '';
    const foods = await Food.find({ name: new RegExp(q, 'i') }).limit(30);
    res.json(foods);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

exports.getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).send({ message: 'Not found' });
    res.json(food);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

// update/delete by creators/admins
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(food);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};
