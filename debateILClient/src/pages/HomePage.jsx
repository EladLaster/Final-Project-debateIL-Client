import { useEffect, useMemo, useState } from "react";
import LiveDebatesList from "../components/homepage/LiveDebatesList.jsx";
import RegisterableDebatesList from "../components/homepage/RegisterableDebatesList.jsx";
import FinishedDebatesList from "../components/homepage/FinishedDebatesList.jsx";
import DebateStats from "../components/homepage/DebateStats.jsx";
import { getDebates } from "../../services/serverApi"; // שים לב לנתיב

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
        (debate) => debate.status === "scheduled" && getAvailableSpots(debate) > 0
      ),
    [allDebates]
  );

  const finishedDebates = useMemo(
    () => allDebates.filter((debate) => debate.status === "finished"),
    [allDebates]
  );

  if (loading) return <div className="p-6">Loading open debates…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          DebateIL - Open Debates
        </h1>
        <p className="text-gray-600">
          Join active debates or register for upcoming discussions
        </p>
      </div>

      <LiveDebatesList debates={liveDebates} />
      <RegisterableDebatesList debates={registerableDebates} />
      <FinishedDebatesList debates={finishedDebates} />

      <DebateStats />
    </div>
  );
}
