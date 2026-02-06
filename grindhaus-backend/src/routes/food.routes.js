const express = require('express');
const router = express.Router();
const foodCtrl = require('../controllers/food.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAnyRole } = require('../middleware/roles.middleware');

router.get('/search', authenticate, foodCtrl.search); // optional public
router.get('/:id', authenticate, foodCtrl.getFood);
router.post('/', authenticate, requireAnyRole(['creator','admin']), foodCtrl.createFood);
router.put('/:id', authenticate, requireAnyRole(['creator','admin']), foodCtrl.updateFood);
router.delete('/:id', authenticate, requireAnyRole(['creator','admin']), foodCtrl.deleteFood);

module.exports = router;
