import { makeAutoObservable } from "mobx";
import { login } from "../services/serverApi";

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
    return userWithDefaults;
  };

  handleRegister = async () => {
    // ...השלם כאן את הפונקציה...
  };

  handleLogout = () => {
    localStorage.removeItem("activeUser");
    this.activeUser = null;
  };
}

export const authStore = new AuthStore();
