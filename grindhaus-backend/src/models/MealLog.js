const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, default: 1 }, // number of servings
  mealType: { type: String, enum: ['breakfast','lunch','dinner','snack'], default: 'snack' }
});

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  entries: [mealEntrySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MealLog', mealLogSchema);
