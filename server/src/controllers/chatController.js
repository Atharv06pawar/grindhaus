const {
  listNotifications,
  markAllNotificationsRead,
  sendMessage
} = require("../services/chatService");

async function message(req, res) {
  const text = req.body.message || req.body.text;
  const response = await sendMessage(req.user, text);

  res.json(response);
}

function notifications(req, res) {
  res.json(listNotifications(req.user));
}

function readNotifications(req, res) {
  res.json(markAllNotificationsRead(req.user));
}

module.exports = {
  message,
  notifications,
  readNotifications
};
