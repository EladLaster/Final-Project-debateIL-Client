import { useMemo } from "react";
import ContentCard from "../../ui/ContentCard";

export default function DebateStats({ debates = [] }) {
  // Calculate platform statistics
  const stats = useMemo(() => {
    const totalDebates = debates.length;
    const liveDebates = debates.filter((d) => d.status === "live").length;
    const scheduledDebates = debates.filter(
      (d) => d.status === "scheduled"
    ).length;
    const finishedDebates = debates.filter(
      (d) => d.status === "finished"
    ).length;

    // Calculate total participants
    const uniqueParticipants = new Set();
    debates.forEach((debate) => {
      if (debate.user1_id) uniqueParticipants.add(debate.user1_id);
      if (debate.user2_id) uniqueParticipants.add(debate.user2_id);
    });

    // Calculate average debate duration (mock calculation)
    const avgDuration = finishedDebates > 0 ? "1.5 hours" : "N/A";

    return {
      totalDebates,
      liveDebates,
      scheduledDebates,
      finishedDebates,
      totalParticipants: uniqueParticipants.size,
      avgDuration,
    };
  }, [debates]);

  const statItems = [
    {
      title: "Total Debates",
      value: stats.totalDebates,
      icon: "💬",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Live Now",
      value: stats.liveDebates,
      icon: "🔴",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Scheduled",
      value: stats.scheduledDebates,
      icon: "⏰",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Finished",
      value: stats.finishedDebates,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Participants",
      value: stats.totalParticipants,
      icon: "👥",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Avg Duration",
      value: stats.avgDuration,
      icon: "⏱️",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  return (
    <ContentCard className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📊 Platform Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((stat, index) => (
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
  );
}
