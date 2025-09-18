import { makeAutoObservable } from "mobx";
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

// Authentication API functions
async function login(email, password) {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.data.success) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

async function register(userData) {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    if (response.data.success) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

async function getUserById(userId) {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.USERS}/${userId}`);
    return data?.user;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    throw normalizeError(err);
  }
}

class AuthStore {
  constructor() {
    makeAutoObservable(this);
    this.activeUser = null;
    this.isLoading = false;
    this.initializeAuth();
  }

  initializeAuth = async () => {
    this.isLoading = true;
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        const user = await getUserById(storedUserId);
        if (user) {
          this.activeUser = user;
        } else {
          localStorage.removeItem("userId");
        }
      }
    } catch (error) {
      console.log("No active session found");
      localStorage.removeItem("userId");
    } finally {
      this.isLoading = false;
    }
  };

  handleLogin = async (email, password) => {
    this.isLoading = true;
    try {
      const user = await login(email, password);
      localStorage.setItem("userId", user.id);
      this.activeUser = user;

      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { user: this.activeUser },
        })
      );

      return this.activeUser;
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  };

  handleRegister = async (userData) => {
    this.isLoading = true;
    try {
      const user = await register(userData);
      localStorage.setItem("userId", user.id);
      this.activeUser = user;
      return this.activeUser;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  };

  handleLogout = () => {
    localStorage.removeItem("userId");
    this.activeUser = null;

    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { user: null },
      })
    );
  };

  refreshUserProfile = async () => {
    if (!this.activeUser?.id) return null;

    try {
      const user = await getUserById(this.activeUser.id);
      if (user) {
        this.activeUser = user;
        return user;
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
    return null;
  };
}

export const authStore = new AuthStore();

// Export API functions for use in components
export { login, register, getUserById };
