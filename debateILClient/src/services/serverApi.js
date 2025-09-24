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

// Cookie-based authentication only - no headers needed

// Error handling utility - now uses centralized error handler
const normalizeError = (error, context = {}) => {
  const friendlyError = handleApiError(error, context);
  return new Error(friendlyError.message);
};

// Authentication API
export async function login(email, password) {
  try {
    console.log("🔐 Client: Attempting login for:", email);
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

    console.log("🔐 Client: Login response:", response.data);
    console.log("🔐 Client: Response headers:", response.headers);
    console.log("🔐 Client: Cookies after login:", document.cookie);

    if (response.data.success) {
      return response.data.user; // Return user data from server
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    console.log("🔐 Client: Login error:", error);
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

// Debates API
export async function getDebates() {
  try {
    console.log("📊 Client: Getting debates...");
    console.log("📊 Client: Cookies before request:", document.cookie);
    const { data } = await api.get(API_ENDPOINTS.DEBATES);
    console.log("📊 Client: Debates response:", data);
    return data?.debates ?? [];
  } catch (err) {
    console.log("📊 Client: Get debates error:", err);
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
      { userId } // Send userId in request body
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
