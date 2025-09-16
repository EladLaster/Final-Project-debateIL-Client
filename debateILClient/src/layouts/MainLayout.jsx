import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function MainLayout() {
  return (
    <div className="app-root bg-white text-gray-900" dir="ltr" lang="en">
      <Header />
      <main className="container-page flex-1 py-6">
        <Outlet />
      </main>
    </div>
  );
}
