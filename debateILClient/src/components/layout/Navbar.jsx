import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { brandColors } from "../../data/brandColors";
import { authStore } from "../../stores/authStore";
import UserAvatar from "../basic-ui/UserAvatar";
import logoImg from "../../assets/logo.png";

function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(authStore.activeUser);
  const userMenuRef = useRef(null);

  // Update user state when authStore changes
  useEffect(() => {
    console.log("Navbar: authStore.activeUser changed:", authStore.activeUser);
    setUser(authStore.activeUser);
  }, [authStore.activeUser]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChange = (event) => {
      console.log("Navbar: Received authStateChanged event:", event.detail);
      setUser(event.detail.user);
    };

    window.addEventListener("authStateChanged", handleAuthStateChange);
    return () => {
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header style={{ background: brandColors.bgLight }}>
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo - Clickable to go home */}
        <NavLink className="flex items-center space-x-3" to="/">
          <span className="sr-only">Home</span>
          <img
            src={logoImg}
            alt="DebateIL Logo"
            className="h-14 w-auto"
            style={{
              borderRadius: 12,
              border: `3px solid ${brandColors.primary}`,
              boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
            }}
          />
          <div className="hidden sm:block">
            <h1
              className="text-xl font-bold"
              style={{ color: brandColors.primary }}
            >
              DebateIL
            </h1>
            <p className="text-xs" style={{ color: brandColors.secondary }}>
              Where Ideas Collide
            </p>
          </div>
        </NavLink>

        {/* User Section */}
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-4">
            {user ? (
              // User is logged in - show user menu
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-80 border-2"
                  style={{
                    background: brandColors.accent,
                    color: brandColors.primary,
                    borderColor: brandColors.primary,
                  }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserAvatar 
                    user={user} 
                    size="medium" 
                    className="border-2"
                    style={{ borderColor: brandColors.primary }}
                  />
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold">
                      {user.firstName ||
                        user.name ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </div>
                    <div className="text-xs opacity-75">
                      {user.email || "user@example.com"}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                    style={{
                      background: brandColors.bgLight,
                      border: `1px solid ${brandColors.primary}`,
                    }}
                  >
                    <div className="py-1">
                      <NavLink
                        to={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm transition hover:opacity-80"
                        style={{ color: brandColors.primary }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        פרופיל שלי
                      </NavLink>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm transition hover:opacity-80"
                        style={{ color: brandColors.primary }}
                        onClick={() => {
                          authStore.handleLogout();
                          setUserMenuOpen(false);
                        }}
                      >
                        התנתק
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login/register buttons
              <div className="flex gap-4">
                <NavLink
                  className="block rounded-md px-5 py-2.5 text-sm font-medium transition"
                  style={{
                    background: brandColors.secondary,
                    color: brandColors.accent,
                  }}
                  to="/login"
                >
                  התחבר
                </NavLink>

                <NavLink
                  className="hidden rounded-md px-5 py-2.5 text-sm font-medium transition sm:block"
                  style={{
                    background: brandColors.primary,
                    color: brandColors.accent,
                    marginLeft: 8,
                  }}
                  to="/register"
                >
                  הרשם
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
