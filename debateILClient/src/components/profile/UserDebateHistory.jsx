import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import StatusBadge from "../basic-ui/StatusBadge";
import { getAvatarById } from "../../api/randomAvatar";

export default function UserDebateHistory({ userId, debates = [] }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { text: "🔴 Live", variant: "live" },
      scheduled: { text: "⏰ Scheduled", variant: "scheduled" },
      finished: { text: "✅ Finished", variant: "finished" },
    };
    return statusConfig[status] || { text: status, variant: "default" };
  };

  const getResultBadge = (debate, userId) => {
    if (debate.status !== "finished") return null;

    if (debate.winner_id === userId) {
      return <span className="text-green-600 font-semibold">👑 Won</span>;
    } else if (debate.user1?.id === userId || debate.user2?.id === userId) {
      return <span className="text-red-600 font-semibold">❌ Lost</span>;
    }
    return <span className="text-gray-600">-</span>;
  };

  if (debates.length === 0) {
    return (
      <ContentCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📚 Debate History
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-500">No debates participated yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Join your first debate to see your history here!
          </p>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        📚 Debate History
      </h2>
      <div className="space-y-4">
        {debates.map((debate) => {
          const opponent =
            debate.user1?.id === userId ? debate.user2 : debate.user1;
          const statusConfig = getStatusBadge(debate.status);

          return (
            <div
              key={debate.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                {/* Debate Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {debate.topic}
                    </h3>
                    <StatusBadge variant={statusConfig.variant}>
                      {statusConfig.text}
                    </StatusBadge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>{formatDate(debate.start_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>⏰</span>
                      <span>{formatTime(debate.start_time)}</span>
                    </div>
                    {debate.status === "finished" && (
                      <div className="flex items-center space-x-2">
                        <span>⭐</span>
                        <span>{debate.final_score || "0-0"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opponent Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <img
                      src={getAvatarById(opponent?.id || 1)}
                      alt={opponent?.firstName || "Opponent"}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      vs {opponent?.firstName || "TBD"}
                    </p>
                  </div>

                  {/* Result */}
                  <div className="text-center">
                    {getResultBadge(debate, userId)}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  {debate.status === "finished" ? (
                    <PrimaryButton
                      variant="outline"
                      size="small"
                      onClick={() => navigate(`/replay/${debate.id}`)}
                    >
                      🎬 Replay
                    </PrimaryButton>
                  ) : debate.status === "live" ? (
                    <PrimaryButton
                      variant="secondary"
                      size="small"
                      onClick={() => navigate(`/debate/${debate.id}`)}
                    >
                      🎯 Join
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton variant="outline" size="small" disabled>
                      ⏰ Waiting
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
}
