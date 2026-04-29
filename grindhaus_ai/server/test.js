const { sendToCpp } = require("./bridge");

const sampleMessages = [
  { userId: "demo-user", text: "my name is Rohan" },
  { userId: "demo-user", text: "my weight is 78.5" },
  { userId: "demo-user", text: "goal is cut to 12 percent body fat" },
  { userId: "demo-user", text: "what do you know about me?" }
];

async function run() {
  for (const payload of sampleMessages) {
    const response = await sendToCpp(payload);
    console.log(`> ${payload.text}`);
    console.log(`< ${response.reply}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
