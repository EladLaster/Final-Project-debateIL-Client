import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DebateSection from "../components/homepage/DebateSection";
import DebateStats from "../components/homepage/DebateStats";
import { getDebates } from "../services/serverApi";
import { authStore } from "../stores/authStore";
import CreateDebateModal from "../components/debate-room/CreateDebateModal";
import PrimaryButton from "../components/basic-ui/PrimaryButton";

function HomePage() {
  const [allDebates, setAllDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const loadDebates = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const list = await getDebates();
      setAllDebates(Array.isArray(list) ? list : []);
      setError("");
    } catch (e) {
      setError(e?.message || "Failed to load debates");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const list = await getDebates();
        if (!alive) return;
        setAllDebates(Array.isArray(list) ? list : []);
        setError("");
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load debates");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    // Refresh every 5 seconds to keep live updates
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // Auto-refresh when user login status changes
  useEffect(() => {
    if (authStore.activeUser) {
      // User just logged in, refresh debates
      loadDebates();
    }
  }, [authStore.activeUser?.id]);

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading debates...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
          <PrimaryButton onClick={() => loadDebates(true)}>
            Try Again
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const handleCreateDebateSuccess = (newDebate) => {
    // Refresh the debates list
    loadDebates();
  };

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

      <DebateSection debates={liveDebates} type="live" />
      {authStore.activeUser && (
        <>
          <DebateSection debates={registerableDebates} type="registerable" />
          <DebateSection debates={finishedDebates} type="finished" />
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

      <DebateStats />

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
