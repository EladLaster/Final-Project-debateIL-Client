import { useEffect, useMemo, useState } from "react";
import { DebateSection, DebateStats } from "../components/homepage";
import { getDebates } from "../services/serverApi";
import { authStore } from "../stores/authStore";

export default function HomePage() {
  const [allDebates, setAllDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const list = await getDebates(); // מושך את כולם מהשרת
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
    // אופציונלי: ריענון כל 5 שניות כדי לשמור על “לייב”
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // אם אין available_spots מהשרת – מחשבים מיידית (ברירת מחדל 2 מקומות)
  const getAvailableSpots = (d) => {
    if (typeof d?.available_spots === "number") return d.available_spots;
    const max = d?.max_participants ?? 2;
    const joined = d?.participants_count ?? 0;
    return Math.max(0, max - joined);
  };

  // בדיוק אותם פילטרים כמו אצלך
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

  if (loading) return <div className="p-6">Loading open debates…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const handleTestLogin = async () => {
    try {
      await authStore.handleLogin("test@example.com", "password");
      console.log("Test login successful");
    } catch (error) {
      console.error("Test login failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          DebateIL - Open Debates
        </h1>
        <p className="text-gray-600">
          Join active debates or register for upcoming discussions
        </p>

        {/* Debug: Test login button */}
        {!authStore.activeUser && (
          <div className="mt-4">
            <button
              onClick={handleTestLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Login (for debugging)
            </button>
          </div>
        )}
      </div>

      <DebateSection debates={liveDebates} type="live" />
      <DebateSection debates={registerableDebates} type="registerable" />
      <DebateSection debates={finishedDebates} type="finished" />

      <DebateStats />
    </div>
  );
}
