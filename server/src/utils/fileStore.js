const fs = require("fs");
const path = require("path");

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function ensureJsonFile(filePath, defaultValue) {
  ensureDirectory(path.dirname(filePath));

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return Array.isArray(defaultValue) ? [...defaultValue] : { ...defaultValue };
  }

  try {
    const rawValue = fs.readFileSync(filePath, "utf8").trim();

    if (!rawValue) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return Array.isArray(defaultValue) ? [...defaultValue] : { ...defaultValue };
    }

    return JSON.parse(rawValue);
  } catch (_error) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return Array.isArray(defaultValue) ? [...defaultValue] : { ...defaultValue };
  }
}

function writeJsonFile(filePath, value) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

module.exports = {
  ensureDirectory,
  ensureJsonFile,
  writeJsonFile
};
