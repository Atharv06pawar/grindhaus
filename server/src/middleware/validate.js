const AppError = require("../utils/AppError");

function validateBody(validator) {
  return (req, _res, next) => {
    const { value, error } = validator(req.body || {});

    if (error) {
      next(new AppError(400, error));
      return;
    }

    req.body = value;
    next();
  };
}

function validateParams(validator) {
  return (req, _res, next) => {
    const { value, error } = validator(req.params || {});

    if (error) {
      next(new AppError(400, error));
      return;
    }

    req.params = value;
    next();
  };
}

module.exports = {
  validateBody,
  validateParams
};
