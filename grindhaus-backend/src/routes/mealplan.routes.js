const express = require('express');
const router = express.Router();
const mpCtrl = require('../controllers/mealplan.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAnyRole } = require('../middleware/roles.middleware');

router.post('/', authenticate, requireAnyRole(['creator','admin']), mpCtrl.createPlan);
router.get('/templates', authenticate, mpCtrl.getTemplates);
router.post('/assign', authenticate, requireAnyRole(['admin','owner']), mpCtrl.assignPlanToUser);

module.exports = router;
