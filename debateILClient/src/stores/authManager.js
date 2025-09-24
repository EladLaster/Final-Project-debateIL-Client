import { makeAutoObservable } from "mobx";
import { login, register, logout } from "../services/serverApi";
import { handleAuthError } from "../utils/errorHandler";

/**
 * Centralized Authentication Manager
 * Handles all authentication state and operations
 */
class AuthManager {
  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  // State
  user = null;
  isAuthenticated = false;
  isLoading = false;
  error = null;
  lastActivity = null;

  // Initialize authentication state
  initializeAuth() {
    try {
      const storedUser = localStorage.getItem("activeUser");
      if (storedUser && storedUser !== "undefined") {
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.lastActivity = Date.now();
        this.validateToken();
      }
    } catch (error) {
      this.clearAuth();
    }
  }

  // Validate token and refresh if needed
  async validateToken() {
    if (!this.isAuthenticated) return false;

    try {
      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - this.lastActivity;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        await this.refreshToken();
      }
    } catch (error) {
      this.clearAuth();
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      // In a real app, you'd call a refresh endpoint
      // For now, we'll just update the activity time
      this.lastActivity = Date.now();
      this.persistAuth();
    } catch (error) {
      this.clearAuth();
    }
  }

  // Login
  async login(email, password) {
    this.setLoading(true);
    this.setError(null);

    try {
      const user = await login(email, password);

      // Normalize user data
      const normalizedUser = this.normalizeUser(user);

      this.setUser(normalizedUser);
      this.setAuthenticated(true);
      this.lastActivity = Date.now();
      this.persistAuth();

      this.dispatchAuthEvent("login", normalizedUser);
      return normalizedUser;
    } catch (error) {
      const friendlyError = handleAuthError(error, {
        action: "login",
        component: "AuthManager",
        data: { email },
      });
      this.setError(friendlyError.message);
      throw new Error(friendlyError.message);
    } finally {
      this.setLoading(false);
    }
  }

  // Register
  async register(userData) {
    this.setLoading(true);
    this.setError(null);

    try {
      const user = await register(userData);

      const normalizedUser = this.normalizeUser(user);

      this.setUser(normalizedUser);
      this.setAuthenticated(true);
      this.lastActivity = Date.now();
      this.persistAuth();

      this.dispatchAuthEvent("register", normalizedUser);
      return normalizedUser;
    } catch (error) {
      const friendlyError = handleAuthError(error, {
        action: "register",
        component: "AuthManager",
        data: { email: userData.email },
      });
      this.setError(friendlyError.message);
      throw new Error(friendlyError.message);
    } finally {
      this.setLoading(false);
    }
  }

  // Logout
  async logout() {
    try {
      // Call server logout if needed
      await logout();
    } catch (error) {
      // Continue with logout even if server call fails
    } finally {
      this.clearAuth();
      this.dispatchAuthEvent("logout", null);
    }
  }

  // Normalize user data
  normalizeUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || user.name || user.email?.split("@")[0],
      lastName: user.lastName || "",
      username: user.username,
      name: user.name || user.firstName || user.email?.split("@")[0],
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      ...user,
    };
  }

  // Persist authentication state
  persistAuth() {
    if (this.isAuthenticated && this.user) {
      localStorage.setItem("activeUser", JSON.stringify(this.user));
      localStorage.setItem("lastActivity", this.lastActivity.toString());
    } else {
      localStorage.removeItem("activeUser");
      localStorage.removeItem("lastActivity");
    }
  }

  // Clear authentication state
  clearAuth() {
    this.user = null;
    this.isAuthenticated = false;
    this.error = null;
    this.lastActivity = null;
    this.persistAuth();
  }

  // Dispatch authentication events
  dispatchAuthEvent(type, user) {
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { type, user, isAuthenticated: this.isAuthenticated },
      })
    );
  }

  // Setters
  setUser(user) {
    this.user = user;
  }

  setAuthenticated(authenticated) {
    this.isAuthenticated = authenticated;
  }

  setLoading(loading) {
    this.isLoading = loading;
  }

  setError(error) {
    this.error = error;
  }

  // Getters
  get isLoggedIn() {
    return this.isAuthenticated && this.user;
  }

  get userId() {
    return this.user?.id;
  }

  get userEmail() {
    return this.user?.email;
  }

  get userName() {
    return this.user?.name || this.user?.firstName;
  }

  // Activity tracking
  updateActivity() {
    this.lastActivity = Date.now();
    this.persistAuth();
  }

  // Check if user is active (within last 30 minutes)
  isActive() {
    if (!this.lastActivity) return false;
    const inactiveTime = Date.now() - this.lastActivity;
    return inactiveTime < 30 * 60 * 1000; // 30 minutes
  }
}

// Create singleton instance
export const authManager = new AuthManager();
export default authManager;
