import { useParams, Link } from "react-router-dom";
import {
  getDebateById,
  getArgumentsWithUserInfo,
  getVotesForDebate,
} from "../data/mockData";
import ContentCard from "../components/basic-ui/ContentCard.jsx";
import StatusBadge from "../components/basic-ui/StatusBadge.jsx";
import PrimaryButton from "../components/basic-ui/PrimaryButton.jsx";
import ArgumentCard from "../components/debate-room/ArgumentCard.jsx";

export default function DebatePage() {
  const { id } = useParams();
  const debateId = parseInt(id);

  // Get debate data
  const debate = getDebateById(debateId);
  const debateArguments = getArgumentsWithUserInfo(debateId);
  const votes = getVotesForDebate(debateId);

  if (!debate) {
    return (
      <div className="p-6">
        <ContentCard className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Debate Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The debate you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <PrimaryButton>← Back to Home</PrimaryButton>
          </Link>
        </ContentCard>
      </div>
    );
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      live: { text: "🔴 Live Now", variant: "live" },
      scheduled: { text: "⏰ Scheduled", variant: "scheduled" },
      finished: { text: "✅ Finished", variant: "finished" },
    };

    const config = statusConfig[status] || { text: status, variant: "default" };
    return <StatusBadge variant={config.variant}>{config.text}</StatusBadge>;
  };

  const isLive = debate.status === "live";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Debates
        </Link>
      </div>

      {/* Debate Header */}
      <ContentCard className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {debate.topic}
            </h1>
            {getStatusBadge(debate.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">📅 Date:</span>
            <div>{formatDate(debate.start_time)}</div>
          </div>
          <div>
            <span className="font-medium">⏰ Time:</span>
            <div>
              {formatTime(debate.start_time)} - {formatTime(debate.end_time)}
            </div>
          </div>
          <div>
            <span className="font-medium">👥 Participants:</span>
            <div>{votes.length} voting</div>
          </div>
        </div>

        {/* Live indicator */}
        {isLive && (
          <div className="mt-4 flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Discussion in progress</span>
          </div>
        )}
      </ContentCard>

      {/* Arguments Section */}
      <ContentCard className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          💬 Arguments ({debateArguments.length})
        </h2>

        {debateArguments.length > 0 ? (
          <div className="space-y-4">
            {debateArguments.map((argument) => (
              <ArgumentCard
                key={argument.id}
                argument={argument}
                onVote={(argumentId) =>
                  console.log("Vote on argument:", argumentId)
                }
                onReply={(argumentId) =>
                  console.log("Reply to argument:", argumentId)
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No arguments yet. Be the first to contribute!
          </p>
        )}
      </ContentCard>

      {/* Action Buttons */}
      <div className="flex space-x-4 justify-center">
        {isLive && (
          <>
            <PrimaryButton variant="secondary" size="large">
              🎤 Add Argument
            </PrimaryButton>
            <PrimaryButton variant="primary" size="large">
              👍 Vote
            </PrimaryButton>
          </>
        )}

        {debate.status === "finished" && (
          <Link to={`/replay/${debate.id}`}>
            <PrimaryButton variant="outline" size="large">
              🔄 Watch Replay
            </PrimaryButton>
          </Link>
        )}

        {debate.status === "scheduled" && (
          <PrimaryButton variant="primary" size="large">
            📝 Register for Debate
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
