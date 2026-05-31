const path = require("path");

process.env.AI_MEMORY_FILE =
  process.env.AI_MEMORY_FILE || path.join(__dirname, "data", "test-ai-memory.json");

const app = require("./server");

async function run() {
  const port = 5050;
  const baseUrl = `http://localhost:${port}/api/v1`;
  const server = app.listen(port);

  try {
    const username = `tester_${Date.now()}`;
    const password = "redaesth123";

    const signupResponse = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const signupData = await signupResponse.json();

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const loginData = await loginResponse.json();
    const authHeaders = {
      "Authorization": `Bearer ${loginData.token}`,
      "Content-Type": "application/json"
    };

    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: authHeaders
    });
    const meData = await meResponse.json();

    const messageResponse = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ message: "My goal is muscle gain and I had 80g protein today" })
    });
    const messageData = await messageResponse.json();

    const legacyMessageResponse = await fetch(`${baseUrl}/chat/message`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ text: "I drank 1.2L water today" })
    });
    const legacyMessageData = await legacyMessageResponse.json();

    const notificationsResponse = await fetch(`${baseUrl}/chat/notifications`, {
      method: "GET",
      headers: authHeaders
    });
    const notificationsData = await notificationsResponse.json();

    const postResponse = await fetch(`${baseUrl}/community/posts`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ content: "Leg day done. No excuses." })
    });
    const postData = await postResponse.json();

    console.log("Signup:", signupData.user.username);
    console.log("Login:", loginData.user.username);
    console.log("Session:", meData.user.username);
    console.log("AI:", messageData.response || messageData.reply || "AI response unavailable");
    console.log("Legacy AI:", legacyMessageData.response || legacyMessageData.reply || "AI response unavailable");
    console.log("Notifications:", notificationsData.notifications.length);
    console.log("Post:", postData.content);
  } finally {
    server.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
