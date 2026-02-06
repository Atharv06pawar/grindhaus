const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAnyRole } = require('../middleware/roles.middleware');

router.get('/videos/pending', authenticate, requireAnyRole(['admin','owner']), adminCtrl.listPending);
router.post('/videos/:id/review', authenticate, requireAnyRole(['admin','owner']), adminCtrl.review);

module.exports = router;
