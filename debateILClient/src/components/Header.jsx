import { NavLink } from "react-router-dom";

// Header super basic - just text logo and simple nav
export default function Header() {
  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/debate/1", label: "Live Debate" },
    { to: "/replay/1", label: "Replay" },
    { to: "/profile/1", label: "Profile" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-gray-900">
          DebateIL
        </NavLink>

        {/* Navigation */}
        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
