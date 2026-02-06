const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner','admin','creator','user'], default: 'user' },
  age: Number,
  weightKg: Number,
  heightCm: Number,
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  activityLevel: { type: String, enum: ['sedentary','light','moderate','active','very_active'], default: 'moderate' },
  goal: { type: String, enum: ['bulk','cut','maintain'], default: 'maintain' },
  bio: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
  // optional: verification / badges
  badges: [String]
});

module.exports = mongoose.model('User', userSchema);
