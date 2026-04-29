const express = require("express");

const { getCurrentSession, login, signup } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const { validateBody } = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { validateCredentials } = require("../validators/authValidators");

const router = express.Router();

router.post("/signup", validateBody(validateCredentials), asyncHandler(signup));
router.post("/login", validateBody(validateCredentials), asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(getCurrentSession));

module.exports = router;
