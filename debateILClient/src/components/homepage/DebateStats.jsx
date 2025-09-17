import { getDebateStats } from "../../data/mockData.js";

export default function DebateStats() {
  const stats = getDebateStats();

  const statItems = [
    {
      title: "Live Debates",
      value: stats.liveDebates,
      icon: "•",
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    {
      title: "Scheduled Debates",
      value: stats.scheduledDebates,
      icon: "⏰",
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📊 Platform Stats
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <span className={`${stat.textColor} text-sm font-bold`}>
                      {stat.icon}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
