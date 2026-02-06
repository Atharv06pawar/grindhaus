const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  weightKg: Number,
  bodyFatPercent: Number,
  photos: [String], // urls
  createdAt: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Progress', progressSchema);
