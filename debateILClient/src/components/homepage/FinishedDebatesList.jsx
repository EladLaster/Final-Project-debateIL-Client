import { useNavigate } from "react-router-dom";
import PrimaryButton from "../basic-ui/PrimaryButton";
import DebateGrid from "./DebateGrid";

export default function FinishedDebatesList({ debates }) {
  const navigate = useNavigate();

  const handleViewReplay = (debateId) => {
    navigate(`/replay/${debateId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWinner = (debate) => {
    if (debate.winner_id === debate.user1?.id) return debate.user1;
    if (debate.winner_id === debate.user2?.id) return debate.user2;
    return null;
  };

  const renderMiddleContent = (debate) => {
    const winner = getWinner(debate);

    return (
      <>
        {winner && (
          <div className="flex items-center justify-center space-x-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <span className="text-lg">👑</span>
            <span className="font-medium">Winner: {winner.firstName}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-center">
            <span className="font-medium text-gray-700 block">📅</span>
            <div className="text-sm font-bold text-gray-800">
              {formatDate(debate.end_time || debate.start_time)}
            </div>
          </div>
          <div className="text-center">
            <span className="font-medium text-gray-700 block">⭐</span>
            <div className="text-lg font-bold text-gray-800">
              {debate.final_score || "0-0"}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderButton = (debate) => (
    <PrimaryButton
      variant="secondary"
      onClick={() => handleViewReplay(debate.id)}
      className="w-full text-sm py-2"
    >
      🎬 Watch Replay
    </PrimaryButton>
  );

  return (
    <DebateGrid
      debates={debates}
      title="✅ Finished Debates"
      emptyMessage="No finished debates to show yet"
      titleColor="text-gray-600"
      renderMiddleContent={renderMiddleContent}
      renderButton={renderButton}
      getWinner={getWinner}
    />
  );
}
