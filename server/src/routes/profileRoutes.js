const express = require("express");

const { getProfile, patchProfile } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");
const { validateBody } = require("../middleware/validate");
const { validateProfileUpdate } = require("../validators/profileValidators");

const router = express.Router();

router.get("/me", requireAuth, getProfile);
router.patch("/me", requireAuth, validateBody(validateProfileUpdate), patchProfile);

module.exports = router;
