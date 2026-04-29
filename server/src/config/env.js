const DEFAULT_PORT = 5000;
const API_PREFIX = "/api/v1";
const DEFAULT_JWT_SECRET = "grindhaus-local-dev-secret";
const DEFAULT_JWT_EXPIRES_IN = "7d";

function toPort(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
}

const config = {
  port: toPort(process.env.PORT || DEFAULT_PORT),
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  apiPrefix: API_PREFIX,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN,
  nodeEnv: process.env.NODE_ENV || "development"
};

module.exports = config;
