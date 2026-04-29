const AppError = require("../utils/AppError");

function notFoundHandler(req, _res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isOperationalError = error instanceof AppError;
  const message = isOperationalError ? error.message : "Internal server error.";

  if (statusCode === 500) {
    console.error("Unhandled server error:", error);
  }

  res.status(statusCode).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
