import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDebate, getArgumentsForDebate } from "../stores/usersStore";
import { usersStore } from "../stores/usersStore";
import { getVoteResults } from "../services/votingApi";
import UserAvatar from "../components/ui/UserAvatar";
import { formatDateTime } from "../utils/formatters";

export default function ReplayPage() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [argumentsList, setArgumentsList] = useState([]);
  const [voteResults, setVoteResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDebateData();
  }, [id]);

  const loadDebateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const debateData = await getDebate(id);
      if (!debateData) {
        setError("Debate not found");
        return;
      }

      // Load arguments for the debate
      const argumentsData = await getArgumentsForDebate(id);
      setArgumentsList(argumentsData || []);

      // Load vote results
      try {
        const votes = await getVoteResults(id);
        setVoteResults(votes);
      } catch (voteError) {
        console.warn("Could not load vote results:", voteError);
        // Fallback to debate scores
        setVoteResults({
          user1Votes: debateData.score_user1 || 0,
          user2Votes: debateData.score_user2 || 0,
          totalVotes:
            (debateData.score_user1 || 0) + (debateData.score_user2 || 0),
          user1Percent: 50,
          user2Percent: 50,
        });
      }

      // Load user data for participants
      if (debateData.user1_id || debateData.user2_id) {
        await usersStore.loadUsersForDebates([debateData]);
      }

      setDebate(debateData);
    } catch (err) {
      setError(err.message || "Failed to load debate");
    } finally {
      setLoading(false);
    }
  };

  // Get user data for participants
  const user1 = debate?.user1_id
    ? usersStore.getUserForComponent(debate.user1_id)
    : null;
  const user2 = debate?.user2_id
    ? usersStore.getUserForComponent(debate.user2_id)
    : null;

  // Calculate winner
  const getWinner = () => {
    if (!debate || !voteResults) return null;

    const user1Score = voteResults.user1Votes || 0;
    const user2Score = voteResults.user2Votes || 0;

    if (user1Score > user2Score)
      return { user: user1, side: "user1", score: user1Score };
    if (user2Score > user1Score)
      return { user: user2, side: "user2", score: user2Score };
    return { user: null, side: "tie", score: user1Score };
  };

  // Calculate debate duration
  const getDebateDuration = () => {
    if (!debate?.start_time || !debate?.end_time) return null;

    const start = new Date(debate.start_time);
    const end = new Date(debate.end_time);
    const durationMs = end - start;

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading replay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Debate Not Found
          </h2>
          <p className="text-gray-600">
            The debate you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const winner = getWinner();
  const duration = getDebateDuration();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 Debate Replay
          </h1>
          <h2 className="text-xl text-gray-600">{debate.topic}</h2>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="mb-8">
            {winner.side === 'tie' ? (
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🤝</div>
                <h3 className="text-2xl font-bold text-yellow-800">It's a Tie!</h3>
                <p className="text-yellow-700">Both participants scored {winner.score} points</p>
              </div>
            ) : (
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-2xl font-bold text-green-800">Winner!</h3>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <UserAvatar user={winner.user} size="xl" />
                  <div>
                    <p className="text-lg font-semibold text-green-700">
                      {winner.user?.firstName} {winner.user?.lastName}
                    </p>
                    <p className="text-green-600">{winner.score} votes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Participants */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Participants</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserAvatar user={user1} size="large" />
                <div>
                  <p className="font-medium text-gray-900">
                    {user1?.firstName} {user1?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">User 1</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UserAvatar user={user2} size="large" />
                <div>
                  <p className="font-medium text-gray-900">
                    {user2?.firstName} {user2?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">User 2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vote Results */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Vote Results</h3>
            {voteResults && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Votes:</span>
                  <span className="font-semibold">{voteResults.totalVotes}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">User 1:</span>
                    <span className="font-semibold">{voteResults.user1Votes} ({voteResults.user1Percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${voteResults.user1Percent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">User 2:</span>
                    <span className="font-semibold">{voteResults.user2Votes} ({voteResults.user2Percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${voteResults.user2Percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Debate Info */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Debate Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  debate.status === 'finished' ? 'bg-red-100 text-red-800' :
                  debate.status === 'live' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {debate.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Started:</span>
                <div className="text-gray-500">{formatDateTime(debate.start_time)}</div>
              </div>
              {debate.end_time && (
                <div>
                  <span className="font-medium text-gray-600">Ended:</span>
                  <div className="text-gray-500">{formatDateTime(debate.end_time)}</div>
                </div>
              )}
              {duration && (
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <div className="text-gray-500">{duration}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arguments Section */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Debate Arguments</h3>
            <p className="text-gray-600 mt-1">
              {argumentsList.length} argument{argumentsList.length !== 1 ? 's' : ''} total
            </p>
          </div>
          
          <div className="p-6">
            {argumentsList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Arguments</h4>
                <p className="text-gray-500">This debate had no arguments recorded.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {argumentsList.map((arg, idx) => {
                  const isUser1 = arg.user_id === debate.user1_id;
                  const author = isUser1 ? user1 : user2;

                  return (
                    <div
                      key={arg.id || idx}
                      className={`flex ${isUser1 ? "justify-start" : "justify-end"} mb-6`}
                    >
                      <div className={`max-w-2xl ${isUser1 ? "order-1" : "order-2"}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            isUser1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {arg.text || arg.content || "No content"}
                          </p>
                        </div>
                        <div
                          className={`flex items-center space-x-2 mt-2 ${
                            isUser1 ? "justify-start" : "justify-end"
                          }`}
                        >
                          <UserAvatar user={author} size="small" />
                          <div className={`text-xs text-gray-500 ${isUser1 ? "text-left" : "text-right"}`}>
                            <div className="font-medium">
                              {author?.firstName} {author?.lastName}
                            </div>
                            {arg.createdAt && (
                              <div>
                                {(() => {
                                  const date = new Date(arg.createdAt);
                                  return date.toLocaleTimeString('he-IL', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  });
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
