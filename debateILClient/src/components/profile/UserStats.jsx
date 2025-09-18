import ContentCard from "../basic-ui/ContentCard";

export default function UserStats({ user }) {
  if (!user) return null;

  const stats = [
    {
      title: "Win Rate",
      value: user.winRate || "0%",
      icon: "🏆",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Average Score",
      value: user.averageScore || "0",
      icon: "📊",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Debate Streak",
      value: user.currentStreak || "0",
      icon: "🔥",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Ranking",
      value: user.ranking || "Unranked",
      icon: "🥇",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  const achievements = [
    {
      title: "First Debate",
      description: "Participated in your first debate",
      icon: "🎯",
      earned: user.debatesParticipated > 0,
    },
    {
      title: "Debate Master",
      description: "Won 10 debates",
      icon: "👑",
      earned: (user.debatesWon || 0) >= 10,
    },
    {
      title: "Argumentative",
      description: "Made 50 arguments",
      icon: "💬",
      earned: (user.argumentsCount || 0) >= 50,
    },
    {
      title: "Popular Opinion",
      description: "Received 100 votes",
      icon: "👍",
      earned: (user.votesReceived || 0) >= 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <ContentCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
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
