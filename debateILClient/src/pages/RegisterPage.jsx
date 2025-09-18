import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { brandColors } from "../data/brandColors";
import logoImg from "../assets/logo.png";
import { authStore } from "../stores/authStore";
import PrimaryButton from "../components/basic-ui/PrimaryButton";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await authStore.handleRegister(userData);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: error.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: brandColors.bgLight }}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow p-8 border-2"
        style={{ borderColor: brandColors.primary }}
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoImg}
            alt="DebateIL Logo"
            className="h-16 mb-4"
            style={{
              borderRadius: 8,
            }}
          />
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: brandColors.primary }}
          >
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Join the debate community
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
                style={{ color: brandColors.text }}
              >
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  borderColor: errors.firstName
                    ? "#ef4444"
                    : brandColors.primary,
                }}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
                style={{ color: brandColors.text }}
              >
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  borderColor: errors.lastName
                    ? "#ef4444"
                    : brandColors.primary,
                }}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                borderColor: errors.username ? "#ef4444" : brandColors.primary,
              }}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                borderColor: errors.email ? "#ef4444" : brandColors.primary,
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                borderColor: errors.password
                  ? "#ef4444"
                  : brandColors.secondary,
              }}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                borderColor: errors.confirmPassword
                  ? "#ef4444"
                  : brandColors.secondary,
              }}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            variant="primary"
            size="large"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: brandColors.primary }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
