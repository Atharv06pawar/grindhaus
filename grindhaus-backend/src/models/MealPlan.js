const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: plans can be user-specific or template
  name: { type: String, required: true },
  description: String,
  days: { type: Map, of: [String] }, // { "1": ["Breakfast: ...", "Lunch: ..."], "2": [...] }
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin/creator
  isTemplate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
