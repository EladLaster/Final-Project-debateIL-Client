// Input validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

// Advanced validation functions
export const validateDebateTopic = (topic) => {
  if (!topic || topic.trim().length < 10) {
    return {
      isValid: false,
      message: "Topic must be at least 10 characters long",
    };
  }
  if (topic.length > 200) {
    return {
      isValid: false,
      message: "Topic must be less than 200 characters",
    };
  }
  return { isValid: true };
};

export const validateArgument = (argument) => {
  if (!argument || argument.trim().length < 5) {
    return {
      isValid: false,
      message: "Argument must be at least 5 characters long",
    };
  }
  if (argument.length > 1000) {
    return {
      isValid: false,
      message: "Argument must be less than 1000 characters",
    };
  }
  return { isValid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }
  if (name.length > 50) {
    return { isValid: false, message: "Name must be less than 50 characters" };
  }
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }
  return { isValid: true };
};

// Form validation helpers
export const getValidationErrors = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      if (!rule.validator(value)) {
        errors[field] = rule.message;
      }
    });
  });

  return errors;
};

// Comprehensive form validation
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!validateRequired(formData.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!validatePassword(formData.password)) {
    errors.password =
      "Password must be at least 8 characters with uppercase, lowercase, and number";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  const firstNameValidation = validateName(formData.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message;
  }

  const lastNameValidation = validateName(formData.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
