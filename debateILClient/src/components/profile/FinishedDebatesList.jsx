import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import { getAvatarById } from "../../utils/randomAvatar";

export default function FinishedDebatesList({ debates }) {
  const navigate = useNavigate();
  const finishedDebates = debates.filter((d) => d.status === "finished");

  if (finishedDebates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-600">
          ✅ Finished Debates
        </h2>
        <p className="text-gray-500 text-center py-8">
          No finished debates to show
        </p>
      </section>
    );
  }

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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-600">
        ✅ Finished Debates
      </h2>
      <div className="space-y-4">
        {finishedDebates.map((debate) => (
          <ContentCard key={debate.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {debate.topic}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>📅 {formatDate(debate.scheduled_time)}</span>
                  {debate.scores?.hasScores && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      💯 Final Score: {debate.scores.user1Score} -{" "}
                      {debate.scores.user2Score}
                    </span>
                  )}
                </div>

                {/* Participants with winner indication */}
                <div className="flex items-center justify-center gap-8 mb-3">
                  {/* User 1 */}
                  {debate.user1 && (
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarById(debate.user1.id)}
                        alt={debate.user1.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            debate.scores?.winner?.userId === debate.user1.id
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {debate.user1.firstName} {debate.user1.lastName}
                          {debate.scores?.winner?.userId ===
                            debate.user1.id && <span className="ml-1">👑</span>}
                        </div>
                        {debate.scores?.hasScores && (
                          <div className="text-sm text-gray-500">
                            {debate.scores.user1Score} points
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-lg font-bold text-gray-400">VS</div>

                  {/* User 2 */}
                  {debate.user2 && (
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarById(debate.user2.id)}
                        alt={debate.user2.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            debate.scores?.winner?.userId === debate.user2.id
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {debate.user2.firstName} {debate.user2.lastName}
                          {debate.scores?.winner?.userId ===
                            debate.user2.id && <span className="ml-1">👑</span>}
                        </div>
                        {debate.scores?.hasScores && (
                          <div className="text-sm text-gray-500">
                            {debate.scores.user2Score} points
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Winner announcement */}
                {debate.scores?.winner && (
                  <div className="text-center mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      🏆 Winner: {debate.scores.winner.firstName}{" "}
                      {debate.scores.winner.lastName}
                    </span>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <PrimaryButton
                  onClick={() => handleViewReplay(debate.id)}
                  variant="secondary"
                >
                  View Replay
                </PrimaryButton>
              </div>
            </div>
          </ContentCard>
        ))}
      </div>
    </section>
  );
}
