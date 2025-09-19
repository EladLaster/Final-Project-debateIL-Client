import { makeAutoObservable } from "mobx";
import axios from "axios";
import { APP_CONFIG, API_ENDPOINTS } from "../utils/constants";

// API configuration
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
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

// API functions
async function getUserById(userId) {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.USERS}/${userId}`, {
      withCredentials: true,
    });
    return data?.user;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    throw normalizeError(err);
  }
}

async function getDebates() {
  try {
    const { data } = await api.get(API_ENDPOINTS.DEBATES, {
      withCredentials: true,
    });
    // Handle both success and failure responses
    if (data?.success === false) {
      return [];
    }
    return data?.debates ?? [];
  } catch (err) {
    if (err?.response?.status === 404) return [];
    throw normalizeError(err);
  }
}

async function getDebate(id) {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.DEBATES}/${id}`, {
      withCredentials: true,
    });
    return data?.debate;
  } catch (err) {
    throw normalizeError(err);
  }
}

async function getArgumentsForDebate(debateId) {
  try {
    const { data } = await api.get(
      `${API_ENDPOINTS.DEBATES}/${debateId}/arguments`,
      {
        withCredentials: true,
      }
    );
    return data?.arguments ?? [];
  } catch (err) {
    if (err?.response?.status === 404) return [];
    throw normalizeError(err);
  }
}

async function createDebate(debateData) {
  try {
    const response = await api.post(API_ENDPOINTS.DEBATES, debateData);
    if (response.data.success) {
      return response.data.newDebate;
    } else {
      throw new Error(response.data.message || "Failed to create debate");
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

async function registerForDebate(debateId, userId) {
  try {
    const currentDebate = await getDebate(debateId);

    if (!currentDebate) {
      throw new Error("Debate not found");
    }

    if (
      currentDebate.user1_id === userId ||
      currentDebate.user2_id === userId
    ) {
      throw new Error("You are already registered for this debate");
    }

    if (currentDebate.user1_id && currentDebate.user2_id) {
      throw new Error("This debate is already full");
    }

    const updateData = {};
    if (!currentDebate.user1_id) {
      updateData.user1_id = userId;
    } else if (!currentDebate.user2_id) {
      updateData.user2_id = userId;
    }

    const response = await api.put(
      `${API_ENDPOINTS.DEBATES}/${debateId}`,
      updateData
    );
    if (response.data.success) {
      return response.data.updatedDebate;
    } else {
      throw new Error(response.data.message || "Failed to register for debate");
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

// Simple cache for users
const userCache = new Map();

class UsersStore {
  constructor() {
    makeAutoObservable(this);
    this.loadingUsers = new Set();
  }

  async getUser(userId) {
    if (!userId) return null;

    // Return from cache if available
    if (userCache.has(userId)) {
      return userCache.get(userId);
    }

    // Prevent duplicate requests
    if (this.loadingUsers.has(userId)) {
      return null;
    }

    // Fetch from server
    this.loadingUsers.add(userId);
    try {
      const userData = await getUserById(userId);
      if (userData) {
        userCache.set(userId, userData);
        return userData;
      } else {
        // User not found on server
        return null;
      }
    } catch (error) {
      // Server error
      return null;
    } finally {
      this.loadingUsers.delete(userId);
    }
  }

  getUserForComponent(userId) {
    if (!userId) return null;

    // Return cached user if available
    const cachedUser = userCache.get(userId);
    if (cachedUser) {
      return cachedUser;
    }

    // Start loading if not already loading
    if (!this.loadingUsers.has(userId)) {
      this.getUser(userId);
    }

    // Return null while loading (component will re-render when data arrives)
    return null;
  }

  async loadUsersForDebates(debates) {
    const userIds = new Set();

    debates.forEach((debate) => {
      if (debate.user1_id) userIds.add(debate.user1_id);
      if (debate.user2_id) userIds.add(debate.user2_id);
    });

    // Filter out already cached users
    const uncachedUserIds = Array.from(userIds).filter(
      (id) => !userCache.has(id)
    );

    if (uncachedUserIds.length > 0) {
      const promises = uncachedUserIds.map((id) => this.getUser(id));
      await Promise.all(promises);
    }

    // Return cached users, create fallbacks for missing ones
    return Array.from(userIds).map((id) => {
      const cachedUser = userCache.get(id);
      if (cachedUser) {
        return cachedUser;
      }
      // Create fallback for missing users
      const fallbackUser = {
        id: id,
        firstName: `User ${id.slice(0, 8)}`,
        lastName: "",
        email: null,
        username: null,
      };
      userCache.set(id, fallbackUser);
      return fallbackUser;
    });
  }

  clearCache() {
    userCache.clear();
    this.loadingUsers.clear();
  }

  getCacheStats() {
    return {
      cachedUsers: userCache.size,
      loadingUsers: this.loadingUsers.size,
    };
  }
}

export const usersStore = new UsersStore();

// Export API functions for use in components
export {
  getDebates,
  getDebate,
  getArgumentsForDebate,
  createDebate,
  registerForDebate,
};
