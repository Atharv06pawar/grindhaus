const express = require("express");

const { message } = require("../controllers/chatController");
const requireAuth = require("../middleware/requireAuth");
const { validateBody } = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { validateChatMessage } = require("../validators/chatValidators");

const router = express.Router();

router.post("/message", requireAuth, validateBody(validateChatMessage), asyncHandler(message));

module.exports = router;
