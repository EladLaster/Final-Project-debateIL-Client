import axios from "axios";
import { APP_CONFIG, API_ENDPOINTS } from "../utils/constants";
import { handleApiError } from "../utils/errorHandler";

// API configuration
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include token in headers for mobile compatibility
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Token added to request:", token.substring(0, 20) + "...");
  } else {
    console.log("❌ No token found in localStorage");
  }
  return config;
});

// Error handling utility - now uses centralized error handler
const normalizeError = (error, context = {}) => {
  const friendlyError = handleApiError(error, context);
  return new Error(friendlyError.message);
};

// Authentication API
export async function login(email, password) {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

    if (response.data.success) {
      // Return user data with token for mobile compatibility
      return {
        ...response.data.user,
        token: response.data.token,
      };
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    throw normalizeError(error, {
      action: "login",
      component: "AuthAPI",
      data: { email },
    });
  }
}

export async function register(userData) {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);

    if (response.data.success) {
      return response.data.user; // Return user data from server
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    throw normalizeError(error, {
      action: "register",
      component: "AuthAPI",
      data: { email: userData.email },
    });
  }
}

export async function logout() {
  try {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  } catch (error) {
    // Continue with logout even if server call fails
    return { success: true };
  }
}

// Debates API
export async function getDebates() {
  try {
    const { data } = await api.get(API_ENDPOINTS.DEBATES);
    return data?.debates ?? [];
  } catch (err) {
    if (err?.response?.status === 404) return [];
    throw normalizeError(err, {
      action: "getDebates",
      component: "DebatesAPI",
    });
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
    throw normalizeError(err, {
      action: "getDebate",
      component: "DebatesAPI",
      data: { debateId: id },
    });
  }
}

export async function getDebateStats() {
  try {
    const { data } = await api.get(API_ENDPOINTS.DEBATE_STATS);
    return data;
  } catch (err) {
    throw normalizeError(err, {
      action: "getDebateStats",
      component: "DebatesAPI",
    });
  }
}

export async function createDebate(debateData) {
  try {
    const response = await api.post(API_ENDPOINTS.DEBATES, debateData);

    if (response.data.success) {
      return response.data.newDebate;
    } else {
      throw new Error(response.data.message || "Failed to create debate");
    }
  } catch (error) {
    throw normalizeError(error, {
      action: "createDebate",
      component: "DebatesAPI",
      data: { topic: debateData.topic },
    });
  }
}

export async function registerToDebate(debateId, userId) {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.DEBATES}/${debateId}/register`,
      {} // Don't send userId in body - let server use JWT token
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to register to debate");
    }
  } catch (error) {
    throw normalizeError(error, {
      action: "registerToDebate",
      component: "DebatesAPI",
      data: { debateId, userId },
    });
  }
}

export async function finishDebate(debateId, scores = {}) {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.DEBATES}/${debateId}/finish`,
      scores
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to finish debate");
    }
  } catch (error) {
    throw normalizeError(error, {
      action: "finishDebate",
      component: "DebatesAPI",
      data: { debateId, scores },
    });
  }
}

// Users API
export async function getAllUsers() {
  try {
    const { data } = await api.get("/api/users/users");
    return data?.users ?? [];
  } catch (err) {
    throw normalizeError(err, {
      action: "getAllUsers",
      component: "UsersAPI",
    });
  }
}

export async function getUserById(userId) {
  try {
    const { data } = await api.get(`/api/users/users/${userId}`);
    return data?.user ?? null;
  } catch (err) {
    throw normalizeError(err, {
      action: "getUserById",
      component: "UsersAPI",
      data: { userId },
    });
  }
}

export async function updateUserProfile(profileData) {
  try {
    const { data } = await api.put(`/api/users/profile`, profileData);

    if (data?.success) {
      return data.user;
    } else {
      throw new Error(data?.message || "Failed to update profile");
    }
  } catch (err) {
    throw normalizeError(err, {
      action: "updateUserProfile",
      component: "UsersAPI",
      data: { profileData },
    });
  }
}

export async function deleteDebate(debateId) {
  try {
    const { data } = await api.delete(`/api/debates/${debateId}`);
    return data?.success ?? false;
  } catch (err) {
    throw normalizeError(err, {
      action: "deleteDebate",
      component: "DebatesAPI",
      data: { debateId },
    });
  }
}

export { api };
