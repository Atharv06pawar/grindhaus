const { spawn } = require("child_process");

function sendToCpp(message) {
    return new Promise((resolve, reject) => {
        const process = spawn("../engine_cpp/grind_engine.exe"); // same folder or give path

        let output = "";

        process.stdout.on("data", data => {
            output += data.toString();
        });

        process.stderr.on("data", err => {
            console.error("CPP-ERR:", err.toString());
        });

        process.on("close", () => {
            resolve(output.trim());
        });

        process.stdin.write(message + "\n");
        process.stdin.end();
    });
}

module.exports = { sendToCpp };
