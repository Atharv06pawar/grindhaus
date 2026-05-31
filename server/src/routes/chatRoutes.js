const express = require("express");

const { message, notifications, readNotifications } = require("../controllers/chatController");
const requireAuth = require("../middleware/requireAuth");
const { validateBody } = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { validateChatMessage } = require("../validators/chatValidators");

const router = express.Router();

router.post("/", requireAuth, validateBody(validateChatMessage), asyncHandler(message));
router.post("/message", requireAuth, validateBody(validateChatMessage), asyncHandler(message));
router.get("/notifications", requireAuth, notifications);
router.post("/notifications/read", requireAuth, readNotifications);

module.exports = router;
