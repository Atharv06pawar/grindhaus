const { randomUUID } = require("crypto");

const { readUsers, writeUsers } = require("./dataStoreService");
const { hashPassword, isHashedPassword, verifyPassword } = require("../utils/passwords");
const { nowIso } = require("../utils/time");

function findUserById(userId) {
  return readUsers().find((entry) => entry.userId === userId) || null;
}

function findUserByUsername(username) {
  const normalized = username.toLowerCase();
  return readUsers().find((entry) => entry.username.toLowerCase() === normalized) || null;
}

function toPublicUser(user) {
  return {
    userId: user.userId,
    username: user.username,
    createdAt: user.createdAt
  };
}

function createUser({ username, password }) {
  const users = readUsers();

  const user = {
    userId: randomUUID(),
    username,
    password: hashPassword(password),
    createdAt: nowIso()
  };

  users.push(user);
  writeUsers(users);

  return user;
}

function authenticateUser({ username, password }) {
  const users = readUsers();
  const userIndex = users.findIndex((entry) => entry.username.toLowerCase() === username.toLowerCase());

  if (userIndex < 0) {
    return null;
  }

  const user = users[userIndex];

  if (!verifyPassword(password, user.password)) {
    return null;
  }

  if (!isHashedPassword(user.password)) {
    users[userIndex] = {
      ...user,
      password: hashPassword(password)
    };

    writeUsers(users);
    return users[userIndex];
  }

  return user;
}

module.exports = {
  createUser,
  findUserById,
  findUserByUsername,
  authenticateUser,
  toPublicUser
};
