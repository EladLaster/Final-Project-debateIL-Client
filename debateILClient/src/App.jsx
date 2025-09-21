import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage.jsx";
import DebatePage from "./pages/DebatePage.jsx";
import ReplayPage from "./pages/ReplayPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminPanelPage from "./pages/AdminPanelPage.jsx";
import AdminRoute from "./components/features/admin/AdminRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Debate page without navbar and footer */}
        <Route path="/debate/:id" element={<DebatePage />} />

        {/* All other pages with navbar and footer */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Navbar />
              <main className="flex-1 py-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/replay/:id" element={<ReplayPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanelPage />
                      </AdminRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
