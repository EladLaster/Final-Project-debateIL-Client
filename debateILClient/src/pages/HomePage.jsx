import { getEnhancedDebates, getDebateStats } from "../data/mockData";
import LiveDebatesList from "../components/homepage/LiveDebatesList.jsx";
import RegisterableDebatesList from "../components/profile/RegisterableDebatesList.jsx";
import FinishedDebatesList from "../components/profile/FinishedDebatesList.jsx";

export default function HomePage() {
  // Get all debates for the new component structure
  const allDebates = getEnhancedDebates();
  const stats = getDebateStats();

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

      {/* Live Debates Section */}
      <LiveDebatesList debates={allDebates} />

      {/* Registerable Debates Section */}
      <RegisterableDebatesList debates={allDebates} />

      {/* Finished Debates Section */}
      <FinishedDebatesList debates={allDebates} />

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
