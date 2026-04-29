const express = require("express");

const authRoutes = require("./authRoutes");
const chatRoutes = require("./chatRoutes");
const communityRoutes = require("./communityRoutes");
const profileRoutes = require("./profileRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/profiles", profileRoutes);
router.use("/community", communityRoutes);

module.exports = router;
