import ContentCard from "../../ui/ContentCard";
import {
  calculateUserStatistics,
  calculateAchievements,
  formatStatsForDisplay,
} from "../../../utils/statistics";

export default function UserStats({ user, debates = [] }) {
  if (!user) return null;

  // Calculate statistics using utility functions
  const stats = calculateUserStatistics(user, debates);
  const formattedStats = formatStatsForDisplay(stats);
  const achievements = calculateAchievements(stats);

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <ContentCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {formattedStats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentCard>

      {/* Achievements */}
      <ContentCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🏆 Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`text-2xl ${
                    achievement.earned ? "" : "grayscale"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <div className="font-semibold">{achievement.title}</div>
                  <div className="text-sm opacity-75">
                    {achievement.description}
                  </div>
                  {achievement.earned && (
                    <div className="text-xs font-medium text-green-600 mt-1">
                      ✓ Earned
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentCard>
    </div>
  );
}
