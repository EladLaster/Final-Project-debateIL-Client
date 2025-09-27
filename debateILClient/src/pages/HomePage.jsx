import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DebateSection from "../components/features/homepage/DebateSection";
import DebateStats from "../components/features/homepage/DebateStats";
import { getDebates, getPublicDebates } from "../services/serverApi";
import { authManager } from "../stores/authManager";
import { usersStore } from "../stores/usersStore";
import CreateDebateModal from "../components/features/debate/CreateDebateModal";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useErrorHandler } from "../utils/errorHandler";
import { useOptimizedRefresh } from "../hooks/useOptimizedRefresh";

function HomePage() {
  const [allDebates, setAllDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const loadDebates = useCallback(async () => {
    try {
      // Use public API for non-authenticated users, authenticated API for logged in users
      const list = authManager.user
        ? await getDebates()
        : await getPublicDebates();
      setAllDebates(Array.isArray(list) ? list : []);

      // Load user data for all debates
      if (Array.isArray(list) && list.length > 0) {
        await usersStore.loadUsersForDebates(list);
      }

      setError("");
    } catch (e) {
      const friendlyError = handleError(e, {
        action: "loadDebates",
        component: "HomePage",
      });
      setError(friendlyError.message);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!alive) return;
      setLoading(true);
      setError(""); // Clear any previous errors

      // Always load debates, but show different content based on auth status
      await loadDebates();

      if (alive) setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []); // Remove loadDebates to prevent infinite loop

  // Auto-refresh when user login status changes
  useEffect(() => {
    if (authManager.user) {
      // User just logged in, refresh debates
      loadDebates();
    }
  }, [authManager.user?.id]); // Remove loadDebates to prevent infinite loop

  // Optimized auto-refresh with intelligent intervals
  const {
    isRefreshing,
    error: refreshError,
    manualRefresh,
  } = useOptimizedRefresh(loadDebates, {
    interval: 8000, // 8 seconds for homepage (less frequent)
    enabled: true, // Always enabled to show live debates
    immediate: false, // Don't refresh immediately on mount
    maxRetries: 2,
    backoffMultiplier: 1.5,
    minInterval: 2000,
    maxInterval: 15000,
  });

  // Calculate available spots inline
  const getAvailableSpots = (debate) =>
    2 - (debate.user1_id ? 1 : 0) - (debate.user2_id ? 1 : 0);

  // Filter debates by status
  const liveDebates = allDebates.filter((debate) => debate.status === "live");
  const registerableDebates = allDebates.filter(
    (debate) => debate.status === "scheduled" && getAvailableSpots(debate) > 0
  );
  const finishedDebates = allDebates.filter(
    (debate) => debate.status === "finished"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DebateIL - Live Debates
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {isRefreshing ? "Updating..." : "Live"}
                </span>
              </div>
            </div>
            {authManager.user && (
              <PrimaryButton
                variant="primary"
                size="large"
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                🎯 Create New Debate
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            {authManager.user
              ? "Join active debates or register for upcoming discussions"
              : "Watch live debates and vote for your favorite arguments"}
          </p>
        </div>

      <DebateSection
        debates={liveDebates}
        type="live"
        onRefresh={loadDebates}
      />
      {authManager.user && (
        <>
          <DebateSection
            debates={registerableDebates}
            type="registerable"
            onRefresh={loadDebates}
          />
          <DebateSection
            debates={finishedDebates}
            type="finished"
            onRefresh={loadDebates}
          />
        </>
      )}

        {!authManager.user && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-3xl p-6 mb-8 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">ℹ️</span>
              <h3 className="text-xl font-bold text-purple-800">
                Welcome to DebateIL!
              </h3>
            </div>
            <p className="text-purple-700 mb-4 text-lg">
              You can watch live debates and vote for your favorite arguments
              without logging in. To participate in debates or create new ones,
              please log in.
            </p>
            <div className="flex gap-3 justify-center">
              <PrimaryButton
                variant="primary"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-3"
              >
                🔐 Log In
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3"
              >
                📝 Register
              </PrimaryButton>
            </div>
          </div>
        )}

        <DebateStats debates={allDebates} />

        {/* Create Debate Modal */}
        <CreateDebateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadDebates}
        />
      </div>
    </div>
  );
}

export default HomePage;
