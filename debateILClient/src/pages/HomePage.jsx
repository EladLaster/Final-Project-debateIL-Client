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

  if (loading) return <div className="p-6">Loading open debates…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                DebateIL - Live Debates
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {isRefreshing ? "Updating..." : "Live"}
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              {authManager.user
                ? "Join active debates or register for upcoming discussions"
                : "Watch live debates and vote for your favorite arguments"}
            </p>
          </div>
          {authManager.user && (
            <div className="mt-4 sm:mt-0">
              <PrimaryButton
                variant="primary"
                size="large"
                onClick={() => setShowCreateModal(true)}
              >
                🎯 Create New Debate
              </PrimaryButton>
            </div>
          )}
        </div>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">ℹ️</span>
            <h3 className="text-lg font-semibold text-blue-800">
              Welcome to DebateIL!
            </h3>
          </div>
          <p className="text-blue-700 mb-3">
            You can watch live debates and vote for your favorite arguments
            without logging in. To participate in debates or create new ones,
            please log in.
          </p>
          <div className="flex gap-2">
            <PrimaryButton
              variant="primary"
              onClick={() => navigate("/login")}
              className="text-sm"
            >
              🔐 Log In
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              onClick={() => navigate("/register")}
              className="text-sm"
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
  );
}

export default HomePage;
