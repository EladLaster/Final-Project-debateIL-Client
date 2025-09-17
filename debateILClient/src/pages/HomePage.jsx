import { getEnhancedDebates } from "../data/mockData";
import LiveDebatesList from "../components/homepage/LiveDebatesList.jsx";
import RegisterableDebatesList from "../components/homepage/RegisterableDebatesList.jsx";
import FinishedDebatesList from "../components/homepage/FinishedDebatesList.jsx";
import DebateStats from "../components/homepage/DebateStats.jsx";

export default function HomePage() {
  // Get all debates and filter them for each component
  const allDebates = getEnhancedDebates();

  // Filter debates by status for each component
  const liveDebates = allDebates.filter((debate) => debate.status === "live");
  const registerableDebates = allDebates.filter(
    (debate) => debate.status === "scheduled" && debate.available_spots > 0
  );
  const finishedDebates = allDebates.filter(
    (debate) => debate.status === "finished"
  );

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

      {/* Each component gets only its relevant debates */}
      <LiveDebatesList debates={liveDebates} />
      <RegisterableDebatesList debates={registerableDebates} />
      <FinishedDebatesList debates={finishedDebates} />

      {/* Stats component */}
      <DebateStats />
    </div>
  );
}
