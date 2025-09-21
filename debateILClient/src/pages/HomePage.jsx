import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DebateSection from "../components/features/homepage/DebateSection";
import DebateStats from "../components/features/homepage/DebateStats";
import { getDebates } from "../services/serverApi";
import { authStore } from "../stores/authStore";
import { usersStore } from "../stores/usersStore";
import CreateDebateModal from "../components/features/debate/CreateDebateModal";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useErrorHandler } from "../utils/errorHandler";

function HomePage() {
  const [allDebates, setAllDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  const loadDebates = useCallback(async () => {
    try {
      const list = await getDebates();
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
  }, []); // Remove handleError to prevent infinite loop

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!alive) return;
      setLoading(true);
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
    if (authStore.activeUser) {
      // User just logged in, refresh debates
      loadDebates();
    }
  }, [authStore.activeUser?.id]); // Remove loadDebates to prevent infinite loop

  // Auto refresh every 3 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsAutoRefreshing(true);
        await loadDebates();
        setIsAutoRefreshing(false);
      } catch (error) {
        // Silent fail for auto-refresh
        console.log("Auto-refresh failed:", error.message);
        setIsAutoRefreshing(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [loadDebates]);

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
                  {isAutoRefreshing ? "Updating..." : "Live"}
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              {authStore.activeUser
                ? "Join active debates or register for upcoming discussions"
                : "Watch live debates and vote for your favorite arguments"}
            </p>
          </div>
          {authStore.activeUser && (
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
      {authStore.activeUser && (
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

      {!authStore.activeUser && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Want to see more debates?
          </h3>
          <p className="text-blue-600 mb-4">
            Register to join upcoming debates and view finished discussions
          </p>
          <div className="flex gap-4 justify-center">
            <PrimaryButton
              variant="primary"
              onClick={() => navigate("/register")}
            >
              Register Now
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              Login
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
