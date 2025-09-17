import { getEnhancedDebates, getDebateStats } from "../data/mockData";
import DebateListCard from "../components/homepage/DebateListCard.jsx";

export default function HomePage() {
  // Get enhanced debates data with participant counts
  const openDebates = getEnhancedDebates().filter(
    (debate) => debate.status === "live" || debate.status === "scheduled"
  );

  // Also get some finished debates for display
  const finishedDebates = getEnhancedDebates()
    .filter((debate) => debate.status === "finished")
    .slice(0, 2); // Show only 2 recent finished debates

  const allDisplayDebates = [...openDebates, ...finishedDebates];
  const stats = getDebateStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          DebateIL - Open Debates
        </h1>
        <p className="text-gray-600">
          Join active debates or register for upcoming discussions
        </p>
      </div>

      {/* Debates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {allDisplayDebates.map((debate) => (
          <DebateListCard key={debate.id} debate={debate} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">•</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Live Debates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.liveDebates}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Scheduled Debates
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.scheduledDebates}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
