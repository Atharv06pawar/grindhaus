const express = require('express');
const router = express.Router();
const prog = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, prog.addProgress);
router.get('/:userId?', authenticate, prog.getProgress);

module.exports = router;
