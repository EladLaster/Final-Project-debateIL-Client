import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard.jsx";
import PrimaryButton from "../basic-ui/PrimaryButton.jsx";
import StatusBadge from "../basic-ui/StatusBadge.jsx";

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
          </div>
        </div>

        {/* Debate Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">📅 Date:</span>
            <span>{formatDate(debate.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">⏰ Time:</span>
            <span>{formatTime(debate.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">👥 Participants:</span>
            <span>{debate.participants_count || 0}</span>
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

          {isScheduled && (
            <PrimaryButton
              variant="primary"
              onClick={handleJoinDebate}
              className="flex-1"
            >
              📝 Register for Debate
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
