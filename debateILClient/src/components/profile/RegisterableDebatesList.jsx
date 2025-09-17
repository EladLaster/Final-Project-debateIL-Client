import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import { getAvatarById } from "../../api/randomAvatar";

export default function RegisterableDebatesList({ debates }) {
  const navigate = useNavigate();
  const registerableDebates = debates.filter(
    (d) => d.status === "scheduled" && d.available_spots > 0
  );

  if (registerableDebates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          🆓 Available for Registration
        </h2>
        <p className="text-gray-500 text-center py-8">
          No debates available for registration at the moment
        </p>
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
        🆓 Available for Registration
      </h2>
      <div className="space-y-4">
        {registerableDebates.map((debate) => (
          <ContentCard key={debate.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {debate.topic}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>📅 {formatDateTime(debate.scheduled_time)}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🆓 {debate.available_spots} spot
                    {debate.available_spots === 1 ? "" : "s"} available
                  </span>
                </div>

                {/* Current participants */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Participants:</span>
                  {debate.user1 && (
                    <div className="flex items-center gap-1">
                      <img
                        src={getAvatarById(debate.user1.id)}
                        alt={debate.user1.firstName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{debate.user1.firstName}</span>
                    </div>
                  )}
                  {debate.user2 && (
                    <div className="flex items-center gap-1">
                      <img
                        src={getAvatarById(debate.user2.id)}
                        alt={debate.user2.firstName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{debate.user2.firstName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-4">
                <PrimaryButton onClick={() => handleRegister(debate.id)}>
                  Register
                </PrimaryButton>
              </div>
            </div>
          </ContentCard>
        ))}
      </div>
    </section>
  );
}
