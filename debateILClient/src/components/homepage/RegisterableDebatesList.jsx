import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import StatusBadge from "../basic-ui/StatusBadge";
import { getAvatarById } from "../../api/randomAvatar";

export default function RegisterableDebatesList({ debates }) {
  const navigate = useNavigate();

  // debates already filtered by HomePage - only registerable debates
  if (debates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          🆓 Available for Registration
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-600">
            No debates available for registration at the moment
          </p>
        </div>
      </section>
    );
  }

  const handleRegister = (debateId) => {
    // TODO: Implement registration logic
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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        🆓 Available for Registration ({debates.length})
      </h2>
      <div className="space-y-4">
        {debates.map((debate) => (
          <ContentCard key={debate.id} className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Header with status */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {debate.topic}
                </h3>
                <StatusBadge variant="scheduled">⏰ Scheduled</StatusBadge>
              </div>

              {/* Registration focus - availability highlight */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      🆓 {debate.available_spots} spot
                      {debate.available_spots === 1 ? "" : "s"} available
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Join the battle!
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    📅 {formatDateTime(debate.start_time)}
                  </div>
                </div>
              </div>

              {/* Who's already registered - if anyone */}
              {(debate.user1 || debate.user2) && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
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

                    {/* Show empty slot */}
                    {debate.available_spots > 0 && (
                      <div className="flex items-center gap-2 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg px-3 py-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600">
                          ?
                        </div>
                        <span className="text-sm font-medium text-yellow-700">
                          Your spot awaits!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons - focused on registration */}
              <div className="flex space-x-3 pt-2">
                <PrimaryButton
                  variant="primary"
                  onClick={() => handleRegister(debate.id)}
                  className="flex-1"
                >
                  ⚔️ Join Battle!
                </PrimaryButton>
                <PrimaryButton
                  variant="ghost"
                  onClick={() => navigate(`/debate/${debate.id}`)}
                  size="small"
                >
                  ℹ️ Details
                </PrimaryButton>
              </div>
            </div>
          </ContentCard>
        ))}
      </div>
    </section>
  );
}
