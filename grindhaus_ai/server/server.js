const express = require("express");

const { sendToCpp } = require("./bridge");

const PORT = 5000;
const app = express();

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/message", async (req, res) => {
  const userId = typeof req.body?.userId === "string" ? req.body.userId.trim() : "";
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!userId || !text) {
    res.status(400).json({ reply: "userId and text are required." });
    return;
  }

  try {
    const response = await sendToCpp({ userId, text });
    res.json(response);
  } catch (error) {
    console.error("Bridge error:", error);
    res.status(500).json({ reply: "Engine offline. Fix it and retry." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GrindHaus AI server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
