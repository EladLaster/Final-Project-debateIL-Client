import PrimaryButton from "../basic-ui/PrimaryButton";
import DebateGrid from "./DebateGrid";

export default function RegisterableDebatesList({ debates }) {
  const handleRegister = (debateId) => {
    console.log("Registering for debate:", debateId);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMiddleContent = (debate) => (
    <>
      <div className="flex items-center justify-center space-x-2 text-blue-600 text-sm">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <span className="font-medium">Your spot awaits!</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-center">
          <span className="font-medium text-blue-700 block">📅</span>
          <div className="text-sm font-bold text-blue-800">
            {formatDateTime(debate.start_time)}
          </div>
        </div>
        <div className="text-center">
          <span className="font-medium text-blue-700 block">👥</span>
          <div className="text-lg font-bold text-blue-800">
            {2 - (debate.participants_count || 0)}/2
          </div>
        </div>
      </div>
    </>
  );

  const renderButton = (debate) => (
    <PrimaryButton
      variant="primary"
      onClick={() => handleRegister(debate.id)}
      className="w-full text-sm py-2"
    >
      ⚔️ Join Battle!
    </PrimaryButton>
  );

  return (
    <DebateGrid
      debates={debates}
      title="🆓 Available for Registration"
      emptyMessage="No debates available for registration at the moment"
      titleColor="text-blue-600"
      renderMiddleContent={renderMiddleContent}
      renderButton={renderButton}
    />
  );
}
