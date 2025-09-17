import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard.jsx";
import PrimaryButton from "../basic-ui/PrimaryButton.jsx";
import StatusBadge from "../basic-ui/StatusBadge.jsx";
import { getAvatarById } from "../../utils/randomAvatar";

export default function DebateListCard({ debate }) {
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { text: "🔴 Live", variant: "live" },
      scheduled: { text: "⏰ Scheduled", variant: "scheduled" },
      finished: { text: "✅ Finished", variant: "finished" },
    };

    const config = statusConfig[status] || { text: status, variant: "default" };
    return <StatusBadge variant={config.variant}>{config.text}</StatusBadge>;
  };

  const handleJoinDebate = () => {
    navigate(`/debate/${debate.id}`);
  };

  const handleViewReplay = () => {
    navigate(`/replay/${debate.id}`);
  };

  const isLive = debate.status === "live";
  const isScheduled = debate.status === "scheduled";
  const isFinished = debate.status === "finished";
  const hasAvailableSpots = debate.available_spots > 0;
  const canRegister = isScheduled && hasAvailableSpots;

  return (
    <ContentCard className="p-6">
      <div className="flex flex-col space-y-4">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {debate.topic}
            </h3>
            {getStatusBadge(debate.status)}

            {/* Available spots indicator */}
            {isScheduled && (
              <div className="mt-2">
                {debate.available_spots > 0 ? (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🆓 {debate.available_spots} spot
                    {debate.available_spots === 1 ? "" : "s"} available
                  </div>
                ) : (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🚫 Debate Full
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Participants - prominently displayed below topic */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            ⚔️ Fighters:
          </h4>
          <div className="flex items-center justify-center gap-12 mb-2">
            {/* User 1 Avatar */}
            {debate.user1 && (
              <img
                src={getAvatarById(debate.user1.id)}
                alt={debate.user1.firstName}
                className="w-20 h-20 rounded-full border-2 border-blue-400 shadow"
              />
            )}
            {/* VS label */}
            <div className="text-2xl font-bold text-gray-500">VS</div>
            {/* User 2 Avatar */}
            {debate.user2 && (
              <img
                src={getAvatarById(debate.user2.id)}
                alt={debate.user2.firstName}
                className="w-20 h-20 rounded-full border-2 border-red-400 shadow"
              />
            )}
          </div>
          <div className="flex items-center justify-center gap-12">
            {/* User 1 Name */}
            <div className="text-lg font-bold flex flex-col items-center">
              {debate.user1 ? (
                <span
                  className={`${
                    debate.scores?.winner?.userId === debate.user1.id
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  🥊 {debate.user1.firstName} {debate.user1.lastName}
                  {debate.scores?.hasScores && (
                    <span className="ml-2 text-sm font-medium">
                      ({debate.scores.user1Score})
                    </span>
                  )}
                  {debate.scores?.winner?.userId === debate.user1.id && (
                    <span className="ml-1">👑</span>
                  )}
                </span>
              ) : (
                <span className="text-gray-400">🎯 Waiting for fighter...</span>
              )}
            </div>
            {/* User 2 Name */}
            <div className="text-lg font-bold flex flex-col items-center">
              {debate.user2 ? (
                <span
                  className={`${
                    debate.scores?.winner?.userId === debate.user2.id
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  🥊 {debate.user2.firstName} {debate.user2.lastName}
                  {debate.scores?.hasScores && (
                    <span className="ml-2 text-sm font-medium">
                      ({debate.scores.user2Score})
                    </span>
                  )}
                  {debate.scores?.winner?.userId === debate.user2.id && (
                    <span className="ml-1">👑</span>
                  )}
                </span>
              ) : (
                <span className="text-gray-400">🎯 Waiting for fighter...</span>
              )}
            </div>
          </div>
        </div>

        {/* Debate Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">📅 Date:</span>
            <span>{formatDate(debate.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">⏰ Time:</span>
            <span>{formatTime(debate.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">👥 Status:</span>
            <span>{debate.participants_count}/2 participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">💬 Arguments:</span>
            <span>{debate.arguments_count || 0}</span>
          </div>
        </div>

        {/* Duration info for live/finished debates */}
        {(isLive || isFinished) && (
          <div className="text-sm text-gray-500">
            Duration: {formatTime(debate.start_time)} -{" "}
            {formatTime(debate.end_time)}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          {isLive && (
            <PrimaryButton
              variant="secondary"
              onClick={handleJoinDebate}
              className="flex-1"
            >
              🎯 Join Live Debate
            </PrimaryButton>
          )}

          {canRegister && (
            <PrimaryButton
              variant="primary"
              onClick={handleJoinDebate}
              className="flex-1"
            >
              ⚔️ Join Battle!
            </PrimaryButton>
          )}

          {isScheduled && !hasAvailableSpots && (
            <PrimaryButton
              variant="outline"
              disabled
              className="flex-1 opacity-50 cursor-not-allowed"
            >
              🚫 Debate Full
            </PrimaryButton>
          )}

          {isFinished && (
            <PrimaryButton
              variant="outline"
              onClick={handleViewReplay}
              className="flex-1"
            >
              🔄 Watch Replay
            </PrimaryButton>
          )}

          {/* Info button for all statuses */}
          <PrimaryButton
            variant="ghost"
            onClick={handleJoinDebate}
            size="small"
          >
            ℹ️ Details
          </PrimaryButton>
        </div>

        {/* Live indicator animation */}
        {isLive && (
          <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Discussion in progress</span>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
