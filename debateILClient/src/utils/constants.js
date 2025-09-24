// Application constants - Dynamic URL based on environment
export const APP_CONFIG = {
  API_BASE_URL: "http://localhost:3030",
  DEBATES_PREFIX: "/api/debates",
  AUTH_PREFIX: "/auth",
};

// Debate status constants
export const DEBATE_STATUS = {
  LIVE: "live",
  SCHEDULED: "scheduled",
  FINISHED: "finished",
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
};

// Local storage keys
export const STORAGE_KEYS = {
  ACTIVE_USER: "activeUser",
  THEME: "theme",
  LANGUAGE: "language",
};

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  DEBATES: "/api/debates",
  DEBATE_STATS: "/api/debates/stats",
  USERS: "/api/users",
};
