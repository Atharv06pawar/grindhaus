const express = require('express');
const router = express.Router();
const mealCtrl = require('../controllers/meal.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/log', authenticate, mealCtrl.addMealLog);
router.get('/summary', authenticate, mealCtrl.getDailySummary);

module.exports = router;
