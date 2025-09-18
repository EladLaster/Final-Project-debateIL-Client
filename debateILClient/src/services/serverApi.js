import axios from "axios";
import { APP_CONFIG, API_ENDPOINTS } from "../utils/constants";

// API configuration
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
});

// Error handling utility
const normalizeError = (error) => {
  if (error.response) {
    return new Error(error.response.data.message || "Server error");
  }
  if (error.request) {
    return new Error("Network error - please check your connection");
  }
  return new Error(error.message || "An unexpected error occurred");
};

// Authentication API
export async function login(email, password) {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    console.log("Login response:", response.data);

    if (response.data.success) {
      return response.data.user; // Return user data from server
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw normalizeError(error);
  }
}

export async function register(userData) {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    console.log("Register response:", response.data);

    if (response.data.success) {
      return response.data.user; // Return user data from server
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Register error:", error);
    throw normalizeError(error);
  }
}

// Debates API
export async function getDebates() {
  try {
    const { data } = await api.get(API_ENDPOINTS.DEBATES);
    // Expects { success, debates }
    return data?.debates ?? [];
  } catch (err) {
    // If server returns 404 when no results - return [] so UI doesn't crash
    if (err?.response?.status === 404) return [];
    throw normalizeError(err);
  }
}

export async function getLiveDebates() {
  return getDebates({ status: "live" });
}

export async function getDebate(id) {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.DEBATES}/${id}`);
    // Expects { success, debate }
    return data?.debate;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getDebateStats() {
  try {
    const { data } = await api.get(API_ENDPOINTS.DEBATE_STATS);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function createDebate(debateData) {
  try {
    const response = await api.post(API_ENDPOINTS.DEBATES, debateData);
    console.log("Create debate response:", response.data);

    if (response.data.success) {
      return response.data.newDebate;
    } else {
      throw new Error(response.data.message || "Failed to create debate");
    }
  } catch (error) {
    console.error("Create debate error:", error);
    throw normalizeError(error);
  }
}

export { api };
