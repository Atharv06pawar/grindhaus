const AppError = require("../utils/AppError");
const { sendMessage } = require("../services/chatService");

async function message(req, res) {
  const { text } = req.body;

  try {
    const response = await sendMessage(req.user, text);
    res.json(response);
  } catch (_error) {
    throw new AppError(503, "AI engine offline. Compile the engine and retry.");
  }
}

module.exports = {
  message
};
