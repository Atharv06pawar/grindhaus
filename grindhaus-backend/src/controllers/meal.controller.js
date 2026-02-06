const MealLog = require('../models/MealLog');
const DailySummary = require('../models/DailySummary');
const Food = require('../models/Food');
const mongoose = require('mongoose');

// create or update meal log for date
exports.addMealLog = async (req, res) => {
  try {
    const { date, entries } = req.body; // entries: [{food, quantity, mealType}]
    const userId = req.user._id;
    const day = new Date(date);
    day.setHours(0,0,0,0);

    let log = await MealLog.findOne({ user: userId, date: day });
    if (!log) {
      log = new MealLog({ user: userId, date: day, entries });
    } else {
      // simple approach: replace entries
      log.entries = entries;
    }
    await log.save();

    // recalc daily summary
    await recalcDailySummary(userId, day);

    res.json(log);
  } catch (err) { console.error(err); res.status(500).send({ message: 'Server error' }); }
};

async function recalcDailySummary(userId, day) {
  // sum macros
  const log = await MealLog.findOne({ user: userId, date: day }).populate('entries.food');
  if (!log) {
    await DailySummary.deleteOne({ user: userId, date: day });
    return;
  }
  let totalCalories=0, totalProtein=0, totalCarbs=0, totalFats=0;
  for (const e of log.entries) {
    const f = e.food;
    const q = e.quantity || 1;
    if (f) {
      totalCalories += (f.calories || 0) * q;
      totalProtein += (f.protein || 0) * q;
      totalCarbs += (f.carbs || 0) * q;
      totalFats += (f.fats || 0) * q;
    }
  }
  await DailySummary.findOneAndUpdate(
    { user: userId, date: day },
    { totalCalories, totalProtein, totalCarbs, totalFats },
    { upsert: true, new: true }
  );
}

// endpoints to get daily summary
exports.getDailySummary = async (req, res) => {
  const date = new Date(req.query.date || new Date());
  date.setHours(0,0,0,0);
  const userId = req.user._id;
  const summary = await DailySummary.findOne({ user: userId, date });
  res.json(summary || {});
};
