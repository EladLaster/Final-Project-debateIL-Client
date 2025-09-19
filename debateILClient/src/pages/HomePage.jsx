import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DebateSection from "../components/features/homepage/DebateSection";
import DebateStats from "../components/features/homepage/DebateStats";
import { getDebates } from "../services/serverApi";
import { authStore } from "../stores/authStore";
import CreateDebateModal from "../components/features/debate/CreateDebateModal";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useErrorHandler } from "../utils/errorHandler";

function HomePage() {
  const [allDebates, setAllDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const loadDebates = useCallback(async () => {
    try {
      const list = await getDebates();
      setAllDebates(Array.isArray(list) ? list : []);
      setError("");
    } catch (e) {
      const friendlyError = handleError(e, {
        action: "loadDebates",
        component: "HomePage",
      });
      setError(friendlyError.message);
    }
  }, []); // Remove handleError from dependencies

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const list = await getDebates(); // Fetch all debates from server
        if (!alive) return;
        setAllDebates(Array.isArray(list) ? list : []);
        setError("");
      } catch (e) {
        if (alive) {
          const friendlyError = handleError(e, {
            action: "loadDebates",
            component: "HomePage",
          });
          setError(friendlyError.message);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // Auto-refresh when user login status changes
  useEffect(() => {
    if (authStore.activeUser) {
      // User just logged in, refresh debates
      loadDebates();
    }
  }, [authStore.activeUser?.id, loadDebates]); // Add loadDebates to dependencies

  // Calculate available spots based on database schema (user1_id, user2_id)
  const getAvailableSpots = (debate) => {
    const maxParticipants = 2; // Each debate has max 2 participants
    let joinedCount = 0;

    if (debate.user1_id) joinedCount++;
    if (debate.user2_id) joinedCount++;

    return Math.max(0, maxParticipants - joinedCount);
  };

  // Filter debates by status
  const liveDebates = useMemo(
    () => allDebates.filter((debate) => debate.status === "live"),
    [allDebates]
  );

  const registerableDebates = useMemo(
    () =>
      allDebates.filter(
        (debate) =>
          debate.status === "scheduled" && getAvailableSpots(debate) > 0
      ),
    [allDebates]
  );

  const finishedDebates = useMemo(
    () => allDebates.filter((debate) => debate.status === "finished"),
    [allDebates]
  );

  const handleCreateDebateSuccess = useCallback(
    (newDebate) => {
      // Refresh the debates list
      loadDebates();
    },
    [loadDebates]
  );

  if (loading) return <div className="p-6">Loading open debates…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DebateIL - Live Debates
            </h1>
            <p className="text-gray-600">
              {authStore.activeUser
                ? "Join active debates or register for upcoming discussions"
                : "Watch live debates and vote for your favorite arguments"}
            </p>
          </div>

          {/* Create Debate Button */}
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
        onSuccess={handleCreateDebateSuccess}
      />
    </div>
  );
}

export default HomePage;
