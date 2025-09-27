import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDebate, getArgumentsForDebate, usersStore } from "../stores/usersStore";
import { getVoteResults } from "../services/votingApi";
import UserAvatar from "../components/ui/UserAvatar";
import { formatDateTime } from "../utils/formatters";

export default function ReplayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading replay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header with Back Button and Status */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">Back to Home</span>
            </button>
            
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-base font-semibold text-gray-700">REPLAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Debate Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏆 {debate.topic || "Debate Replay"}
          </h1>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="mb-8">
            {winner.side === "tie" ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-4xl mb-2">🤝</div>
                <h3 className="text-2xl font-bold text-yellow-800">
                  It's a Tie!
                </h3>
                <p className="text-yellow-700">
                  Both participants scored {winner.score} points
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-6 text-center shadow-xl">
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

        {/* Main Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* User 1 Side */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-1 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  {user1?.avatarUrl ? (
                    <img
                      src={user1.avatarUrl}
                      alt="user1"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : user1 ? (
                    <UserAvatar user={user1} size="2xl" className="w-full h-full rounded-xl" />
                  ) : (
                    <span className="text-purple-300 text-3xl">+</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-purple-700">{user1?.firstName || "User 1"}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200/50">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Debate Arguments</h2>
              </div>
              
              <div className="h-96 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: "none" }}>
                {argumentsList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No arguments recorded.</p>
                  </div>
                ) : (
                  argumentsList
                    .slice()
                    .reverse()
                    .map((argument, idx) => {
                      const isUser1 = argument.user_id === debate.user1_id;
                      const author = isUser1 ? user1 : user2;
                      
                      return (
                        <div
                          key={argument.id || idx}
                          className={`flex items-start gap-3 ${
                            isUser1 ? "justify-start" : "justify-end"
                          }`}
                        >
                          {isUser1 && (
                            <div className="flex items-start gap-3 max-w-md">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {author?.firstName?.charAt(0) || "U"}
                              </div>
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-purple-200">
                                <div className="text-xs font-semibold text-purple-700 mb-1">
                                  {author?.firstName || "User"}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed">{argument.text || argument.content || "No content"}</div>
                              </div>
                            </div>
                          )}
                          {!isUser1 && (
                            <div className="flex items-start gap-3 max-w-md flex-row-reverse">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {author?.firstName?.charAt(0) || "U"}
                              </div>
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-blue-200">
                                <div className="text-xs font-semibold text-blue-700 mb-1 text-right">
                                  {author?.firstName || "User"}
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed text-right">{argument.text || argument.content || "No content"}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
                </div>
              </div>

          {/* User 2 Side */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-1 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  {user2?.avatarUrl ? (
                    <img
                      src={user2.avatarUrl}
                      alt="user2"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : user2 ? (
                    <UserAvatar user={user2} size="2xl" className="w-full h-full rounded-xl" />
                  ) : (
                    <span className="text-blue-300 text-3xl">+</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-blue-700">{user2?.firstName || "User 2"}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Vote Results */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Final Results</h3>
            {voteResults && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-lg font-medium text-gray-600">Total Votes: </span>
                <span className="text-xl font-bold text-gray-900">{voteResults.totalVotes}</span>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700 mb-2">
                      {voteResults.user1Votes} ({voteResults.user1Percent}%)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-700 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${voteResults.user1Percent}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-purple-600 mt-1">{user1?.firstName || "User 1"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                      {voteResults.user2Votes} ({voteResults.user2Percent}%)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${voteResults.user2Percent}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{user2?.firstName || "User 2"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Debate Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Debate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    debate.status === "finished"
                      ? "bg-red-100 text-red-800"
                      : debate.status === "live"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {debate.status.toUpperCase()}
                </span>
              </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Started</div>
              <div className="text-gray-500 text-sm">
                  {formatDateTime(debate.start_time)}
                </div>
              </div>
              {debate.end_time && (
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Duration</div>
                <div className="text-gray-500 text-sm">{duration}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
