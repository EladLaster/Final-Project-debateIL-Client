import { useNavigate } from "react-router-dom";
import PrimaryButton from "../basic-ui/PrimaryButton";
import DebateGrid from "./DebateGrid";

export default function LiveDebatesList({ debates }) {
  const navigate = useNavigate();

  const handleJoinDebate = (debateId) => {
    navigate(`/debate/${debateId}`);
  };

  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.floor((now - start) / (1000 * 60));
    return `${diffMinutes}m`;
  };

  const renderMiddleContent = (debate) => (
    <>
      <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        <span className="font-medium">Discussion in progress</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm border border-red-200 bg-red-50 rounded-lg p-3">
        <div>
          <span className="font-medium text-red-700 block">👥</span>
          <div className="text-lg font-bold text-red-800">
            {debate.participants_count || 2}/2
          </div>
        </div>
        <div>
          <span className="font-medium text-red-700 block">💬</span>
          <div className="text-lg font-bold text-red-800">
            {debate.messages_count || 4}
          </div>
        </div>
        <div>
          <span className="font-medium text-red-700 block">⏱️</span>
          <div className="text-lg font-bold text-red-800">
            {calculateDuration(debate.start_time)}
          </div>
        </div>
      </div>
    </>
  );

  const renderButton = (debate) => (
    <PrimaryButton
      variant="secondary"
      onClick={() => handleJoinDebate(debate.id)}
      className="w-full text-sm py-2"
    >
      🎯 Join Live!
    </PrimaryButton>
  );

  return (
    <DebateGrid
      debates={debates}
      title="🔴 Live Debates"
      emptyMessage="No live debates at the moment. Check back later!"
      titleColor="text-red-600"
      renderMiddleContent={renderMiddleContent}
      renderButton={renderButton}
    />
  );
}
