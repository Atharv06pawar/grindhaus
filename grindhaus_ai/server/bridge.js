const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ENGINE_DIRECTORY = path.join(__dirname, "..", "engine_cpp");
const ENGINE_NAME = process.platform === "win32" ? "grind_engine.exe" : "grind_engine";
const ENGINE_PATH = path.join(ENGINE_DIRECTORY, ENGINE_NAME);
const ENGINE_TIMEOUT_MS = 5000;

function createEngineProcess() {
  if (process.platform === "win32") {
    const escapedEnginePath = ENGINE_PATH.replace(/'/g, "''");
    const command = `$payload = [Console]::In.ReadToEnd(); $payload | & '${escapedEnginePath}'`;

    return spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
      cwd: ENGINE_DIRECTORY,
      windowsHide: true
    });
  }

  return spawn(ENGINE_PATH, [], { cwd: ENGINE_DIRECTORY });
}

function sendToCpp(payload) {
  return new Promise((resolve, reject) => {
    if (!payload || typeof payload.userId !== "string" || typeof payload.text !== "string") {
      reject(new Error("Payload must include string userId and text fields."));
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

        if (typeof response.reply !== "string") {
          throw new Error("Missing reply in C++ response.");
        }

        resolve(response);
      } catch (error) {
        reject(new Error(`Invalid JSON from C++ engine. ${error.message}`));
      }
    });

    child.stdin.write(`${JSON.stringify(payload)}\n`);
    child.stdin.end();
  });
}

module.exports = { sendToCpp };
