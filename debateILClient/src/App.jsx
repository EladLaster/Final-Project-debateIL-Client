import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavigation from "./components/navigation/MainNavigation.jsx";
import HomePage from "./pages/HomePage.jsx";
import DebatePage from "./pages/DebatePage.jsx";
import ReplayPage from "./pages/ReplayPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminPanelPage from "./pages/AdminPanelPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <MainNavigation />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/debate/:id" element={<DebatePage />} />
            <Route path="/replay/:id" element={<ReplayPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
