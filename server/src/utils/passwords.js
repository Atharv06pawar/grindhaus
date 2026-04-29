const { randomBytes, scryptSync, timingSafeEqual } = require("crypto");

const PASSWORD_PREFIX = "scrypt";
const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${PASSWORD_PREFIX}$${salt}$${derivedKey}`;
}

function isHashedPassword(storedValue) {
  return typeof storedValue === "string" && storedValue.startsWith(`${PASSWORD_PREFIX}$`);
}

function compareHashedPassword(password, storedValue) {
  const parts = storedValue.split("$");

  if (parts.length !== 3) {
    return false;
  }

  const [, salt, hashHex] = parts;
  const hashBuffer = Buffer.from(hashHex, "hex");
  const attemptedBuffer = scryptSync(password, salt, KEY_LENGTH);

  if (hashBuffer.length !== attemptedBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, attemptedBuffer);
}

function verifyPassword(password, storedValue) {
  if (typeof password !== "string" || typeof storedValue !== "string") {
    return false;
  }

  if (isHashedPassword(storedValue)) {
    return compareHashedPassword(password, storedValue);
  }

  return storedValue === password;
}

module.exports = {
  hashPassword,
  isHashedPassword,
  verifyPassword
};
