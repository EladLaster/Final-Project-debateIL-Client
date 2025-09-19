import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../../stores/authStore";
import { isAdmin } from "../../../utils/adminAuth";

export default function AdminRoute({ children, requiredPermission = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = () => {
      const user = authStore.activeUser;

      if (!user) {
        // User not logged in, redirect to login
        navigate("/login", {
          state: {
            message: "Please log in to access admin panel",
            redirectTo: "/admin",
          },
        });
        return;
      }

      if (!isAdmin(user)) {
        // User is not admin, redirect to home with error
        navigate("/", {
          state: {
            error: "Access denied: Admin privileges required",
          },
        });
        return;
      }

      // User is admin, allow access
      setHasAccess(true);
      setIsLoading(false);
    };

    // Check immediately
    checkAdminAccess();

    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAdminAccess();
    };

    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, [navigate, requiredPermission]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
