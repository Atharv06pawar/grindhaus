const fs = require("fs");
const { spawn } = require("child_process");

const { ENGINE_DIRECTORY, ENGINE_PATH } = require("../config/paths");

const ENGINE_TIMEOUT_MS = 7000;

function createEngineProcess() {
  return spawn(ENGINE_PATH, [], {
    cwd: ENGINE_DIRECTORY,
    windowsHide: true
  });
}

function sendToEngine(payload) {
  return new Promise((resolve, reject) => {
    if (!payload || typeof payload.userId !== "string" || typeof payload.text !== "string") {
      reject(new Error("Payload must include string userId and text."));
      return;
    }

    if (!fs.existsSync(ENGINE_PATH)) {
      reject(new Error(`C++ engine not found at ${ENGINE_PATH}. Compile the engine first.`));
      return;
    }

    const child = createEngineProcess();
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      settled = true;
      child.kill();
      reject(new Error("C++ engine timed out."));
    }, ENGINE_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);

      if (code !== 0) {
        reject(new Error(stderr.trim() || `C++ engine exited with code ${code}.`));
        return;
      }

      try {
        const response = JSON.parse(stdout.trim());
        resolve(response);
      } catch (error) {
        reject(new Error(`Invalid JSON from C++ engine. ${error.message}`));
      }
    });

    child.stdin.write(`${JSON.stringify(payload)}\n`);
    child.stdin.end();
  });
}

module.exports = {
  sendToEngine
};
