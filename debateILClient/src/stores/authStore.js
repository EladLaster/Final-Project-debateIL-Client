import { makeAutoObservable } from "mobx";
import { login, register } from "../services/serverApi";
import { handleAuthError } from "../utils/errorHandler";

class AuthStore {
  constructor() {
    makeAutoObservable(this);
    this.activeUser =
      localStorage.activeUser && localStorage.activeUser !== "undefined"
        ? JSON.parse(localStorage.activeUser)
        : null;
  }

  handleLogin = async (email, password) => {
    try {
      const user = await login(email, password);

      // Ensure user has required fields
      const userWithDefaults = {
        id: user.id, // Don't create random ID - use server ID only
        email: user.email || email,
        firstName: user.firstName || user.name || email.split("@")[0],
        lastName: user.lastName || "",
        name: user.name || user.firstName || email.split("@")[0],
        ...user,
      };

      localStorage.activeUser = JSON.stringify(userWithDefaults);
      this.activeUser = userWithDefaults;

      // Dispatch custom event for UI updates
      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { user: userWithDefaults },
        })
      );

      return userWithDefaults;
    } catch (error) {
      const friendlyError = handleAuthError(error, {
        action: "handleLogin",
        component: "AuthStore",
        data: { email },
      });
      throw new Error(friendlyError.message);
    }
  };

  handleRegister = async (userData) => {
    try {
      const user = await register(userData);

      // Ensure user has required fields
      const userWithDefaults = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        name: user.firstName,
        ...user,
      };

      localStorage.activeUser = JSON.stringify(userWithDefaults);
      this.activeUser = userWithDefaults;
      return userWithDefaults;
    } catch (error) {
      const friendlyError = handleAuthError(error, {
        action: "handleRegister",
        component: "AuthStore",
        data: { email: userData.email },
      });
      throw new Error(friendlyError.message);
    }
  };

  handleLogout = () => {
    localStorage.removeItem("activeUser");
    this.activeUser = null;

    // Dispatch custom event for UI updates
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { user: null },
      })
    );
  };
}

export const authStore = new AuthStore();
