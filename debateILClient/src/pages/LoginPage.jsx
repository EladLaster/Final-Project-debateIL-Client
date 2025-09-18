import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { brandColors } from "../data/brandColors";
import logoImg from "../assets/logo.png";
import { authStore } from "../stores";
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.handleLogin(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: brandColors.bgLight }}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow p-8 border-2"
        style={{ borderColor: brandColors.primary }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-center flex-1">
            <img
              src={logoImg}
              alt="DebateIL Logo"
              className="h-100 mb-1"
              style={{
                borderRadius: 6,
              }}
            />
            <h2
              className="text-2xl font-bold text-center"
              style={{ color: brandColors.primary }}
            >
              Login
            </h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            title="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: brandColors.primary,
                color: brandColors.text,
              }}
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: brandColors.text }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: brandColors.secondary,
                color: brandColors.text,
              }}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md font-semibold transition"
            style={{
              background: `linear-gradient(90deg, ${brandColors.secondary}, ${brandColors.primary})`,
              color: brandColors.accent,
            }}
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium hover:underline"
              style={{ color: brandColors.primary }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
