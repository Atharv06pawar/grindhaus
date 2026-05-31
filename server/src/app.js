const express = require("express");

const config = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/errors");
const apiRoutes = require("./routes");
const { startCompanionScheduler } = require("../ai/scheduler");
const { initializeDataStore } = require("./services/dataStoreService");

initializeDataStore();
if (process.env.DISABLE_AI_SCHEDULER !== "true") {
  startCompanionScheduler();
}

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const originHeader = req.headers.origin;
  const isWildcard = config.clientOrigin === "*";
  const allowOrigin = isWildcard ? "*" : config.clientOrigin;

  if (isWildcard || originHeader === config.clientOrigin) {
    res.header("Access-Control-Allow-Origin", allowOrigin);
  }

  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(config.apiPrefix, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
