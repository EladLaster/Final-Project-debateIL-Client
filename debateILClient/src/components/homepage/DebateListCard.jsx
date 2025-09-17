import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard.jsx";
import PrimaryButton from "../basic-ui/PrimaryButton.jsx";
import StatusBadge from "../basic-ui/StatusBadge.jsx";
import { getAvatarById } from "../../api/randomAvatar.js";

export default function DebateListCard({ debate, context = "default" }) {
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

  const handleRegister = (debateId) => {
    // TODO: Implement registration logic
    console.log("Registering for debate:", debateId);
  };

  // Context-specific content renderers
  const renderLiveDebateInfo = () => (
    <>
      {/* Live indicator animation */}
      <div className="flex items-center justify-center space-x-2 text-red-600 text-sm mb-4">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        <span className="font-medium">🔴 Discussion in progress</span>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 border border-red-200 bg-red-50 rounded-lg p-3 mb-4">
        <div className="text-center">
          <span className="font-medium text-red-700">👥 Active</span>
          <div className="text-lg font-bold text-red-800">
            {debate.participants_count}/2
          </div>
        </div>
        <div className="text-center">
          <span className="font-medium text-red-700">💬 Arguments</span>
          <div className="text-lg font-bold text-red-800">
            {debate.arguments_count || 0}
          </div>
        </div>
        <div className="text-center">
          <span className="font-medium text-red-700">⏱️ Duration</span>
          <div className="text-lg font-bold text-red-800">
            {(() => {
              const start = new Date(debate.start_time);
              const now = new Date();
              const diffMinutes = Math.floor((now - start) / (1000 * 60));
              return `${diffMinutes}m`;
            })()}
          </div>
        </div>
      </div>
    </>
  );

  const renderRegisterableDebateInfo = () => (
    <>
      {/* Available spots highlight */}
      <div className="mb-4">
        {debate.available_spots > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🆓 {debate.available_spots} spot
                  {debate.available_spots === 1 ? "" : "s"} available
                </span>
              </div>
              <div className="text-sm text-green-600">
                📅{" "}
                {new Date(debate.start_time).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              🚫 Debate Full
            </span>
          </div>
        )}
      </div>

      {/* Who's already registered */}
      {(debate.user1 || debate.user2) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            🥊 Already registered:
          </h4>
          <div className="flex gap-3">
            {debate.user1 && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <img
                  src={getAvatarById(debate.user1.id)}
                  alt={debate.user1.firstName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-blue-800">
                  {debate.user1.firstName} {debate.user1.lastName}
                </span>
              </div>
            )}
            {debate.user2 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <img
                  src={getAvatarById(debate.user2.id)}
                  alt={debate.user2.firstName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-red-800">
                  {debate.user2.firstName} {debate.user2.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  const renderFinishedDebateInfo = () => (
    <>
      {/* Winner announcement - main focus */}
      {debate.scores?.winner && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-800 mb-2">
              🏆 Winner: {debate.scores.winner.firstName}{" "}
              {debate.scores.winner.lastName}
            </div>
            {debate.scores.hasScores && (
              <div className="text-sm text-green-600">
                Final Score: {debate.scores.user1Score} -{" "}
                {debate.scores.user2Score}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Draw case */}
      {debate.scores?.isDraw && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-800 mb-2">
              🤝 It's a Draw!
            </div>
            <div className="text-sm text-yellow-600">
              Final Score: {debate.scores.user1Score} -{" "}
              {debate.scores.user2Score}
            </div>
          </div>
        </div>
      )}

      {/* Brief debate info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div>
          <span className="font-medium">📅 Completed:</span>
          <div>
            {new Date(debate.end_time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <div>
          <span className="font-medium">💬 Total Arguments:</span>
          <div>{debate.arguments_count || 0}</div>
        </div>
      </div>
    </>
  );

  // Render appropriate action buttons based on context
  const renderActionButtons = () => {
    const commonInfoButton = (
      <PrimaryButton
        variant="ghost"
        onClick={handleJoinDebate}
        size="small"
        key="info"
      >
        ℹ️ Details
      </PrimaryButton>
    );

    switch (context) {
      case "live":
        return [
          <PrimaryButton
            key="join"
            variant="secondary"
            onClick={handleJoinDebate}
            className="flex-1"
          >
            🎯 Join Live Debate
          </PrimaryButton>,
          commonInfoButton,
        ];

      case "registerable":
        return [
          <PrimaryButton
            key="register"
            variant="primary"
            onClick={() => handleRegister(debate.id)}
            className="flex-1"
          >
            ⚔️ Join Battle!
          </PrimaryButton>,
          commonInfoButton,
        ];

      case "finished":
        return [
          <PrimaryButton
            key="replay"
            variant="outline"
            onClick={handleViewReplay}
            className="flex-1"
          >
            🔄 Watch Replay
          </PrimaryButton>,
          commonInfoButton,
        ];

      default:
        // Fallback to original logic
        const buttons = [];

        if (isLive) {
          buttons.push(
            <PrimaryButton
              key="join"
              variant="secondary"
              onClick={handleJoinDebate}
              className="flex-1"
            >
              🎯 Join Live Debate
            </PrimaryButton>
          );
        }

        if (canRegister) {
          buttons.push(
            <PrimaryButton
              key="register"
              variant="primary"
              onClick={() => handleRegister(debate.id)}
              className="flex-1"
            >
              ⚔️ Join Battle!
            </PrimaryButton>
          );
        }

        if (isScheduled && !hasAvailableSpots) {
          buttons.push(
            <PrimaryButton
              key="full"
              variant="outline"
              disabled
              className="flex-1 opacity-50 cursor-not-allowed"
            >
              🚫 Debate Full
            </PrimaryButton>
          );
        }

        if (isFinished) {
          buttons.push(
            <PrimaryButton
              key="replay"
              variant="outline"
              onClick={handleViewReplay}
              className="flex-1"
            >
              🔄 Watch Replay
            </PrimaryButton>
          );
        }

        buttons.push(commonInfoButton);
        return buttons;
    }
  };

  return (
    <ContentCard className="p-6">
      <div className="flex flex-col space-y-4">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {debate.topic}
          </h3>
          <div>{getStatusBadge(debate.status)}</div>
        </div>

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

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            ⚔️ Fighters:
          </h4>
          <div className="flex w-full flex-row items-center">
            {/* User 1 */}
            <div className="card bg-gray-50 rounded-box p-4 flex items-center justify-center flex-1">
              {debate.user1 ? (
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarById(debate.user1.id)}
                    alt={debate.user1.firstName}
                    className="w-12 h-12 rounded-full border-2 border-blue-400 shadow"
                  />
                  <div className="text-center">
                    <div
                      className={`font-bold ${
                        debate.scores?.winner?.userId === debate.user1.id
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      🥊 {debate.user1.firstName} {debate.user1.lastName}
                      {debate.scores?.winner?.userId === debate.user1.id && (
                        <span className="ml-1">👑</span>
                      )}
                    </div>
                    {debate.scores?.hasScores && (
                      <div className="text-sm text-gray-600">
                        Score: {debate.scores.user1Score}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">🎯 Waiting for fighter...</span>
              )}
            </div>
            <div className="divider divider-horizontal text-gray-500 font-bold">
              VS
            </div>
            {/* User 2 */}
            <div className="card bg-gray-50 rounded-box p-4 flex items-center justify-center flex-1">
              {debate.user2 ? (
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarById(debate.user2.id)}
                    alt={debate.user2.firstName}
                    className="w-12 h-12 rounded-full border-2 border-red-400 shadow"
                  />
                  <div className="text-center">
                    <div
                      className={`font-bold ${
                        debate.scores?.winner?.userId === debate.user2.id
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      🥊 {debate.user2.firstName} {debate.user2.lastName}
                      {debate.scores?.winner?.userId === debate.user2.id && (
                        <span className="ml-1">👑</span>
                      )}
                    </div>
                    {debate.scores?.hasScores && (
                      <div className="text-sm text-gray-600">
                        Score: {debate.scores.user2Score}
                      </div>
                    )}
                  </div>
                </div>
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
        <div className="flex space-x-3 pt-2">{renderActionButtons()}</div>

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
