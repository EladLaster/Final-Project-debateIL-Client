import { makeAutoObservable } from "mobx";
import { login, register } from "../services/serverApi";

class AuthStore {
  constructor() {
    makeAutoObservable(this);
    this.activeUser =
      localStorage.activeUser && localStorage.activeUser !== "undefined"
        ? JSON.parse(localStorage.activeUser)
        : null;
  }

  handleLogin = async (email, password) => {
    const user = await login(email, password);
    console.log("Login response:", user);

    // Ensure user has required fields
    const userWithDefaults = {
      id: user.id || Math.floor(Math.random() * 1000) + 1,
      email: user.email || email,
      firstName: user.firstName || user.name || email.split("@")[0],
      lastName: user.lastName || "",
      name: user.name || user.firstName || email.split("@")[0],
      ...user,
    };

    console.log("User with defaults:", userWithDefaults);
    localStorage.activeUser = JSON.stringify(userWithDefaults);
    this.activeUser = userWithDefaults;
    console.log("AuthStore activeUser updated:", this.activeUser);

    // Dispatch custom event for UI updates
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { user: userWithDefaults },
      })
    );

    return userWithDefaults;
  };

  handleRegister = async (userData) => {
    try {
      const user = await register(userData);
      console.log("Register response:", user);

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

      console.log("User with defaults:", userWithDefaults);
      localStorage.activeUser = JSON.stringify(userWithDefaults);
      this.activeUser = userWithDefaults;
      return userWithDefaults;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  handleLogout = () => {
    localStorage.removeItem("activeUser");
    this.activeUser = null;
    console.log("AuthStore activeUser cleared:", this.activeUser);
  };
}

export const authStore = new AuthStore();
