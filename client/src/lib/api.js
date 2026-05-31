import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const API_PREFIX = process.env.REACT_APP_API_PREFIX || "/api/v1";

let accessToken = "";
let unauthorizedHandler = null;

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    "Content-Type": "application/json"
  }
});

export function setAccessToken(token) {
  accessToken = token || "";
}

export function bindUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

export function buildWebSocketUrl(path) {
  const explicitBaseUrl = process.env.REACT_APP_WS_URL;

  if (explicitBaseUrl) {
    return `${explicitBaseUrl.replace(/\/$/, "")}${path}`;
  }

  const apiOrigin = API_BASE_URL || window.location.origin;
  const url = new URL(apiOrigin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = path;
  url.search = "";

  return url.toString();
}

export function isRealtimeEnabled() {
  return Boolean(process.env.REACT_APP_WS_URL || process.env.REACT_APP_ENABLE_WS === "true");
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAccessToken("");
      unauthorizedHandler?.();
    }

    const message =
      error.response?.data?.message || error.response?.data?.reply || error.message || "Request failed.";

    return Promise.reject(new Error(message));
  }
);

async function request(config) {
  const response = await apiClient(config);
  return response.data;
}

export function signUp(username, password) {
  return request({
    url: "/auth/signup",
    method: "post",
    data: { username, password }
  });
}

export function loginUser(username, password) {
  return request({
    url: "/auth/login",
    method: "post",
    data: { username, password }
  });
}

export function getCurrentSession() {
  return request({
    url: "/auth/me",
    method: "get"
  });
}

export function sendChatMessage(text) {
  return request({
    url: "/chat",
    method: "post",
    data: { message: text }
  });
}

export function getCompanionNotifications() {
  return request({
    url: "/chat/notifications",
    method: "get"
  });
}

export function markCompanionNotificationsRead() {
  return request({
    url: "/chat/notifications/read",
    method: "post"
  });
}

export function getProfile() {
  return request({
    url: "/profiles/me",
    method: "get"
  });
}

export function updateProfile(payload) {
  return request({
    url: "/profiles/me",
    method: "patch",
    data: payload
  });
}

export function getCommunityPosts() {
  return request({
    url: "/community/posts",
    method: "get"
  });
}

export function createCommunityPost(content) {
  return request({
    url: "/community/posts",
    method: "post",
    data: { content }
  });
}

export function toggleCommunityLike(postId) {
  return request({
    url: `/community/posts/${postId}/like`,
    method: "post"
  });
}

export function createCommunityComment(postId, content) {
  return request({
    url: `/community/posts/${postId}/comment`,
    method: "post",
    data: { content }
  });
}
