import {} from "react";
import { authStore } from "../stores/authStore";

// Custom hook for authentication state and actions
export const useAuth = () => {
  const { activeUser } = authStore;

  const login = async (email, password) => {
    try {
      const user = await authStore.handleLogin(email, password);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authStore.handleLogout();
  };

  const isAuthenticated = () => {
    return !!activeUser;
  };

  const isAdmin = () => {
    return activeUser?.role === "admin";
  };

  return {
    user: activeUser,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    logout,
  };
};
