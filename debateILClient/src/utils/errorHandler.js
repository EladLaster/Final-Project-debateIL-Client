// Simplified Error Handling System

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 * @returns {Object} Normalized error object
 */
export function handleApiError(error, context = {}) {
  let message = "An unexpected error occurred";
  let type = "UNKNOWN_ERROR";

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        message = data?.message || "Invalid request";
        type = "VALIDATION_ERROR";
        break;
      case 401:
        message = "Please log in to continue";
        type = "AUTH_ERROR";
        break;
      case 403:
        message = "You do not have permission to perform this action";
        type = "AUTHZ_ERROR";
        break;
      case 404:
        message = "The requested resource was not found";
        type = "CLIENT_ERROR";
        break;
      case 500:
        message = "Server error. Please try again later";
        type = "SERVER_ERROR";
        break;
      default:
        message = data?.message || `Server error (${status})`;
        type = "SERVER_ERROR";
    }
  } else if (error.request) {
    // Network error
    message = "Network error. Please check your connection";
    type = "NETWORK_ERROR";
  } else {
    // Other error
    message = error.message || "An unexpected error occurred";
    type = "CLIENT_ERROR";
  }

  return {
    message,
    type,
    originalError: error,
    context,
  };
}

/**
 * Handle authentication errors
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 * @returns {Object} Normalized error object
 */
export function handleAuthError(error, context = {}) {
  // Use the main error handler for consistency
  const result = handleApiError(error, context);

  // Override specific auth messages
  if (error.response?.status === 401) {
    result.message = "Invalid email or password";
  } else if (error.response?.status === 409) {
    result.message = "User already exists";
  }

  return result;
}

/**
 * Hook for error handling in components
 * @param {Function} onError - Error callback function
 * @returns {Function} Error handler function
 */
export function useErrorHandler(onError) {
  return (error, context = {}) => {
    const normalizedError = handleApiError(error, context);
    if (onError) {
      onError(normalizedError);
    }
    return normalizedError;
  };
}

/**
 * Display error message to user
 * @param {string} message - Error message
 * @param {string} type - Error type
 */
export function showError(message, type = "error") {
  // Simple alert for now - can be replaced with toast notification
  alert(message);
}

/**
 * Log error for debugging
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  // Log error for debugging (can be replaced with proper logging service)
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  // In production, this would be sent to a logging service
  // For now, we just store the error info
}
