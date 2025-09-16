import { NavLink } from "react-router-dom";
import logoImg from "../assets/logo.png";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <NavLink className="block text-teal-600" to="/">
          <span className="sr-only">Home</span>
          <img src={logoImg} alt="DebateIL Logo" className="h-30" />
        </NavLink>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <NavLink
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/"
                >
                  {" "}
                  Home{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/debate/1"
                >
                  {" "}
                  Live Debate{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/replay/1"
                >
                  {" "}
                  Replay{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/profile/1"
                >
                  {" "}
                  Profile{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="text-gray-500 transition hover:text-gray-500/75"
                  to="/admin"
                >
                  {" "}
                  Admin{" "}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <NavLink
                className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                to="/login"
              >
                Login
              </NavLink>

              <NavLink
                className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
                to="/register"
              >
                Register
              </NavLink>
            </div>

            <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
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
          </div>
        </div>
      </div>
    </header>
  );
}
