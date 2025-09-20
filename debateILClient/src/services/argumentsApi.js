import axios from "axios";
import { APP_CONFIG } from "../utils/constants";
import { handleApiError } from "../utils/errorHandler";

// API configuration
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true,
});

// Error handling utility
const normalizeError = (error, context = {}) => {
  const friendlyError = handleApiError(error, context);
  return new Error(friendlyError.message);
};

/**
 * Arguments API Service
 * Handles all argument-related operations
 */

/**
 * Get all arguments for a specific debate
 * @param {string|number} debateId - The debate ID
 * @returns {Promise<Array>} Array of arguments
 */
export async function getArgumentsForDebate(debateId) {
  try {
    const { data } = await api.get(`/api/debates/${debateId}/arguments`, {
      withCredentials: true,
    });
    
    if (data?.success === false) {
      return [];
    }
    
    return data?.arguments ?? [];
  } catch (err) {
    if (err?.response?.status === 404) return [];
    throw normalizeError(err, {
      action: "getArgumentsForDebate",
      component: "ArgumentsAPI",
      data: { debateId },
    });
  }
}

/**
 * Create a new argument for a debate
 * @param {string|number} debateId - The debate ID
 * @param {string} text - The argument text
 * @returns {Promise<Object>} The created argument
 */
export async function createArgument(debateId, text) {
  try {
    const { data } = await api.post(
      `/api/debates/${debateId}/arguments`,
      { text },
      { withCredentials: true }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to create argument");
    }

    return data?.argument;
  } catch (error) {
    throw normalizeError(error, {
      action: "createArgument",
      component: "ArgumentsAPI",
      data: { debateId, textLength: text?.length },
    });
  }
}

/**
 * Update an existing argument
 * @param {string|number} argumentId - The argument ID
 * @param {string} text - The new argument text
 * @returns {Promise<Object>} The updated argument
 */
export async function updateArgument(argumentId, text) {
  try {
    const { data } = await api.put(
      `/api/arguments/${argumentId}`,
      { text },
      { withCredentials: true }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to update argument");
    }

    return data?.argument;
  } catch (error) {
    throw normalizeError(error, {
      action: "updateArgument",
      component: "ArgumentsAPI",
      data: { argumentId, textLength: text?.length },
    });
  }
}

/**
 * Delete an argument
 * @param {string|number} argumentId - The argument ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteArgument(argumentId) {
  try {
    const { data } = await api.delete(`/api/arguments/${argumentId}`, {
      withCredentials: true,
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to delete argument");
    }

    return true;
  } catch (error) {
    throw normalizeError(error, {
      action: "deleteArgument",
      component: "ArgumentsAPI",
      data: { argumentId },
    });
  }
}

/**
 * Get argument statistics for a debate
 * @param {string|number} debateId - The debate ID
 * @returns {Promise<Object>} Argument statistics
 */
export async function getArgumentStats(debateId) {
  try {
    const { data } = await api.get(`/api/debates/${debateId}/arguments/stats`, {
      withCredentials: true,
    });

    if (data?.success === false) {
      return { totalArguments: 0, argumentsByUser: {} };
    }

    return data?.stats ?? { totalArguments: 0, argumentsByUser: {} };
  } catch (error) {
    // Return default stats if endpoint doesn't exist yet
    return { totalArguments: 0, argumentsByUser: {} };
  }
}

// Export the API instance for advanced usage
export { api as argumentsApi };
