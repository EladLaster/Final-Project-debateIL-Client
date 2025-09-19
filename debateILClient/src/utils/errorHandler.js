// Centralized Error Handling System

/**
 * Error types for different categories
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHZ_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Centralized error handler class
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100; // Keep only last 100 errors
  }

  /**
   * Main error handling method
   * @param {Error|string} error - The error to handle
   * @param {Object} context - Additional context about the error
   * @param {string} context.component - Component where error occurred
   * @param {string} context.action - Action that caused the error
   * @param {Object} context.data - Additional data related to the error
   */
  handle(error, context = {}) {
    const processedError = this.processError(error, context);
    
    // Log error
    this.logError(processedError);
    
    // Handle based on severity
    this.handleBySeverity(processedError);
    
    // Return user-friendly error
    return this.getUserFriendlyError(processedError);
  }

  /**
   * Process and categorize the error
   */
  processError(error, context) {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    const errorType = this.categorizeError(error, errorMessage);
    const severity = this.determineSeverity(errorType, errorMessage);
    
    return {
      id: Date.now() + Math.random(),
      type: errorType,
      severity,
      message: errorMessage,
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
      stack: error?.stack
    };
  }

  /**
   * Categorize error based on message and type
   */
  categorizeError(error, message) {
    const lowerMessage = message.toLowerCase();
    
    // Network errors
    if (lowerMessage.includes('network') || 
        lowerMessage.includes('fetch') || 
        lowerMessage.includes('connection') ||
        error?.code === 'ERR_NETWORK') {
      return ERROR_TYPES.NETWORK;
    }
    
    // Authentication errors
    if (lowerMessage.includes('unauthorized') || 
        lowerMessage.includes('401') ||
        lowerMessage.includes('login') ||
        lowerMessage.includes('authentication')) {
      return ERROR_TYPES.AUTHENTICATION;
    }
    
    // Authorization errors
    if (lowerMessage.includes('forbidden') || 
        lowerMessage.includes('403') ||
        lowerMessage.includes('permission')) {
      return ERROR_TYPES.AUTHORIZATION;
    }
    
    // Server errors
    if (lowerMessage.includes('server') || 
        lowerMessage.includes('500') ||
        lowerMessage.includes('internal')) {
      return ERROR_TYPES.SERVER;
    }
    
    // Validation errors
    if (lowerMessage.includes('validation') || 
        lowerMessage.includes('invalid') ||
        lowerMessage.includes('required')) {
      return ERROR_TYPES.VALIDATION;
    }
    
    return ERROR_TYPES.UNKNOWN;
  }

  /**
   * Determine error severity
   */
  determineSeverity(type, message) {
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return ERROR_SEVERITY.HIGH;
      case ERROR_TYPES.AUTHENTICATION:
        return ERROR_SEVERITY.HIGH;
      case ERROR_TYPES.AUTHORIZATION:
        return ERROR_SEVERITY.MEDIUM;
      case ERROR_TYPES.SERVER:
        return ERROR_SEVERITY.CRITICAL;
      case ERROR_TYPES.VALIDATION:
        return ERROR_SEVERITY.LOW;
      default:
        return ERROR_SEVERITY.MEDIUM;
    }
  }

  /**
   * Log error to internal log
   */
  logError(processedError) {
    this.errorLog.push(processedError);
    
    // Keep only recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${processedError.type}]`);
      console.error('Message:', processedError.message);
      console.error('Context:', processedError.context);
      console.error('Stack:', processedError.stack);
      console.groupEnd();
    }
  }

  /**
   * Handle error based on severity
   */
  handleBySeverity(processedError) {
    switch (processedError.severity) {
      case ERROR_SEVERITY.CRITICAL:
        // Could send to external monitoring service
        this.reportCriticalError(processedError);
        break;
      case ERROR_SEVERITY.HIGH:
        // Could show global notification
        this.showGlobalNotification(processedError);
        break;
      case ERROR_SEVERITY.MEDIUM:
        // Could log to analytics
        this.logToAnalytics(processedError);
        break;
      case ERROR_SEVERITY.LOW:
        // Just log locally
        break;
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyError(processedError) {
    const { type, message, context } = processedError;
    
    // Custom messages based on error type
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return {
          title: 'Connection Error',
          message: 'Please check your internet connection and try again.',
          action: 'Retry',
          type: 'error'
        };
        
      case ERROR_TYPES.AUTHENTICATION:
        return {
          title: 'Authentication Error',
          message: 'Please log in again to continue.',
          action: 'Login',
          type: 'warning'
        };
        
      case ERROR_TYPES.AUTHORIZATION:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          action: 'OK',
          type: 'error'
        };
        
      case ERROR_TYPES.SERVER:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          action: 'Retry',
          type: 'error'
        };
        
      case ERROR_TYPES.VALIDATION:
        return {
          title: 'Invalid Input',
          message: message || 'Please check your input and try again.',
          action: 'OK',
          type: 'warning'
        };
        
      default:
        return {
          title: 'Error',
          message: 'Something went wrong. Please try again.',
          action: 'OK',
          type: 'error'
        };
    }
  }

  /**
   * Report critical errors (placeholder for external services)
   */
  reportCriticalError(error) {
    // In production, this could send to Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 CRITICAL ERROR REPORTED:', error);
    }
  }

  /**
   * Show global notification (placeholder)
   */
  showGlobalNotification(error) {
    // Could integrate with toast notification system
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔔 Global notification:', error.message);
    }
  }

  /**
   * Log to analytics (placeholder)
   */
  logToAnalytics(error) {
    // Could send to Google Analytics, Mixpanel, etc.
    if (process.env.NODE_ENV === 'development') {
      console.info('📊 Analytics log:', error.type, error.message);
    }
  }

  /**
   * Get error history
   */
  getErrorHistory() {
    return this.errorLog;
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {};
    this.errorLog.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1;
    });
    return stats;
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions for common use cases
export const handleApiError = (error, context = {}) => {
  return errorHandler.handle(error, { ...context, category: 'API' });
};

export const handleValidationError = (error, context = {}) => {
  return errorHandler.handle(error, { ...context, category: 'VALIDATION' });
};

export const handleAuthError = (error, context = {}) => {
  return errorHandler.handle(error, { ...context, category: 'AUTH' });
};

export const handleNetworkError = (error, context = {}) => {
  return errorHandler.handle(error, { ...context, category: 'NETWORK' });
};

// React hook for error handling
export const useErrorHandler = () => {
  return {
    handleError: (error, context) => errorHandler.handle(error, context),
    handleApiError: (error, context) => handleApiError(error, context),
    handleValidationError: (error, context) => handleValidationError(error, context),
    handleAuthError: (error, context) => handleAuthError(error, context),
    handleNetworkError: (error, context) => handleNetworkError(error, context),
    getErrorHistory: () => errorHandler.getErrorHistory(),
    getErrorStats: () => errorHandler.getErrorStats(),
    clearErrors: () => errorHandler.clearErrorHistory()
  };
};

