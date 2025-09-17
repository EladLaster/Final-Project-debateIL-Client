import { useNavigate } from "react-router-dom";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import StatusBadge from "../basic-ui/StatusBadge";
import { getAvatarById } from "../../api/randomAvatar";

export default function FinishedDebatesList({ debates }) {
  const navigate = useNavigate();

  // debates already filtered by HomePage - only finished debates
  if (debates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-600">
          ✅ Finished Debates
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No finished debates to show</p>
        </div>
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
        ✅ Finished Debates ({debates.length})
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
                <StatusBadge variant="finished">✅ Finished</StatusBadge>
              </div>

              {/* Results focus - Winner announcement as main highlight */}
              {debate.scores?.winner && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-800 mb-2">
                      🏆 Winner: {debate.scores.winner.firstName}{" "}
                      {debate.scores.winner.lastName}
                    </div>
                    {debate.scores.hasScores && (
                      <div className="text-lg text-green-600">
                        Final Score: {debate.scores.user1Score} -{" "}
                        {debate.scores.user2Score}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Draw case */}
              {debate.scores?.isDraw && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-800 mb-2">
                      🤝 It's a Draw!
                    </div>
                    <div className="text-lg text-yellow-600">
                      Final Score: {debate.scores.user1Score} -{" "}
                      {debate.scores.user2Score}
                    </div>
                  </div>
                </div>
              )}

              {/* Participants with results */}
              <div className="flex items-center justify-center gap-8 border-t border-gray-200 pt-4">
                {debate.user1 && (
                  <div className="text-center">
                    <img
                      src={getAvatarById(debate.user1.id)}
                      alt={debate.user1.firstName}
                      className={`w-12 h-12 rounded-full border-2 mx-auto mb-2 ${
                        debate.scores?.winner?.userId === debate.user1.id
                          ? "border-green-400 ring-2 ring-green-200"
                          : "border-gray-300"
                      }`}
                    />
                    <div
                      className={`font-bold ${
                        debate.scores?.winner?.userId === debate.user1.id
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {debate.user1.firstName} {debate.user1.lastName}
                      {debate.scores?.winner?.userId === debate.user1.id && (
                        <div className="text-sm">👑 WINNER</div>
                      )}
                    </div>
                    {debate.scores?.hasScores && (
                      <div className="text-sm text-gray-600 font-bold">
                        {debate.scores.user1Score} pts
                      </div>
                    )}
                  </div>
                )}

                <div className="text-2xl font-bold text-gray-400">VS</div>

                {debate.user2 && (
                  <div className="text-center">
                    <img
                      src={getAvatarById(debate.user2.id)}
                      alt={debate.user2.firstName}
                      className={`w-12 h-12 rounded-full border-2 mx-auto mb-2 ${
                        debate.scores?.winner?.userId === debate.user2.id
                          ? "border-green-400 ring-2 ring-green-200"
                          : "border-gray-300"
                      }`}
                    />
                    <div
                      className={`font-bold ${
                        debate.scores?.winner?.userId === debate.user2.id
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {debate.user2.firstName} {debate.user2.lastName}
                      {debate.scores?.winner?.userId === debate.user2.id && (
                        <div className="text-sm">👑 WINNER</div>
                      )}
                    </div>
                    {debate.scores?.hasScores && (
                      <div className="text-sm text-gray-600 font-bold">
                        {debate.scores.user2Score} pts
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Brief debate stats */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <div className="text-center">
                  <span className="font-medium">📅 Completed</span>
                  <div>{formatDate(debate.end_time || debate.start_time)}</div>
                </div>
                <div className="text-center">
                  <span className="font-medium">💬 Total Arguments</span>
                  <div>{debate.arguments_count || 0}</div>
                </div>
              </div>

              {/* Action Buttons - focused on replay */}
              <div className="flex space-x-3 pt-2">
                <PrimaryButton
                  variant="outline"
                  onClick={() => handleViewReplay(debate.id)}
                  className="flex-1"
                >
                  🔄 Watch Replay
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
