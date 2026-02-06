const MealPlan = require('../models/MealPlan');

// create template (admin/creator)
exports.createPlan = async (req, res) => {
  const data = req.body;
  data.createdBy = req.user._id;
  const plan = await MealPlan.create(data);
  res.json(plan);
};

exports.getTemplates = async (req, res) => {
  const templates = await MealPlan.find({ isTemplate:true });
  res.json(templates);
};

exports.assignPlanToUser = async (req, res) => {
  const { planId, userId } = req.body;
  const plan = await MealPlan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  const userPlan = plan.toObject();
  userPlan.user = userId;
  userPlan.isTemplate = false;
  const created = await MealPlan.create(userPlan);
  res.json(created);
};
