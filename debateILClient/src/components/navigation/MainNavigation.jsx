import { NavLink } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { brandColors } from "../../data/brandColors";
import { observer } from "mobx-react";
import { authStore } from "../../stores/authStore";

function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

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
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/debate/1", label: "Live Debate" },
    { to: "/replay/1", label: "Replay" },
    { to: "/profile/1", label: "Profile" },
    { to: "/admin", label: "Admin" },
  ];
  return (
    <header style={{ background: brandColors.bgLight }}>
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <NavLink className="block" to="/">
          <span className="sr-only">Home</span>
          <img
            src={logoImg}
            alt="DebateIL Logo"
            className="h-12"
            style={{
              borderRadius: 8,
              border: `2px solid ${brandColors.primary}`,
            }}
          />
        </NavLink>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Desktop nav */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    className="transition px-2 py-1 rounded"
                    style={{ color: brandColors.primary }}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {authStore.activeUser ? (
              // User is logged in - show user menu
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{
                    background: brandColors.primary,
                    color: brandColors.accent,
                  }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span>👤</span>
                  <span>
                    {authStore.activeUser.name || authStore.activeUser.email}
                  </span>
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
                        to={`/profile/${authStore.activeUser.id}`}
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
              <div className="sm:flex sm:gap-4">
                <NavLink
                  className="block rounded-md px-5 py-2.5 text-sm font-medium transition"
                  style={{
                    background: brandColors.secondary,
                    color: brandColors.accent,
                  }}
                  to="/login"
                >
                  Login
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
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="block rounded-sm p-2.5 md:hidden"
              style={{
                background: brandColors.primary,
                color: brandColors.accent,
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Mobile menu */}
            {menuOpen && (
              <nav
                className="md:hidden absolute top-16 left-0 w-full border-t z-50 shadow"
                style={{ background: brandColors.bgLight }}
              >
                <ul className="flex flex-col gap-2 p-4">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        className="block py-2 px-4 rounded"
                        style={{
                          color: brandColors.primary,
                          background: brandColors.accent,
                        }}
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                  {authStore.activeUser ? (
                    // User is logged in - show user info and logout
                    <>
                      <li
                        className="border-t pt-2 mt-2"
                        style={{ borderColor: brandColors.primary }}
                      >
                        <div
                          className="px-4 py-2 text-sm"
                          style={{ color: brandColors.primary }}
                        >
                          מחובר כ:{" "}
                          {authStore.activeUser.name ||
                            authStore.activeUser.email}
                        </div>
                      </li>
                      <li>
                        <NavLink
                          className="block rounded-md px-5 py-2.5 text-sm font-medium mb-2"
                          style={{
                            background: brandColors.primary,
                            color: brandColors.accent,
                          }}
                          to={`/profile/${authStore.activeUser.id}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          פרופיל שלי
                        </NavLink>
                      </li>
                      <li>
                        <button
                          className="block w-full rounded-md px-5 py-2.5 text-sm font-medium text-left"
                          style={{
                            background: brandColors.secondary,
                            color: brandColors.accent,
                          }}
                          onClick={() => {
                            authStore.handleLogout();
                            setMenuOpen(false);
                          }}
                        >
                          התנתק
                        </button>
                      </li>
                    </>
                  ) : (
                    // User is not logged in - show login/register
                    <>
                      <li>
                        <NavLink
                          className="block rounded-md px-5 py-2.5 text-sm font-medium mb-2"
                          style={{
                            background: brandColors.secondary,
                            color: brandColors.accent,
                          }}
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                        >
                          Login
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="block rounded-md px-5 py-2.5 text-sm font-medium"
                          style={{
                            background: brandColors.primary,
                            color: brandColors.accent,
                          }}
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                        >
                          Register
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const MainNavigationWithObserver = observer(MainNavigation);
export default MainNavigationWithObserver;
