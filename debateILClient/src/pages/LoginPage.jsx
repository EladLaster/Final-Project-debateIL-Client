import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { brandColors } from "../data/brandColors";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // No authentication, just redirect
    navigate("/");
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
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: brandColors.primary }}
        >
          Login
        </h2>
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
      </div>
    </div>
  );
}
