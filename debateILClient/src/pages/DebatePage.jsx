import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateArgument, sanitizeInput } from "../utils/validators";
import { getDebate, usersStore, finishDebateForUser } from "../stores/usersStore";
import {
  getArgumentsForDebate,
  createArgument,
} from "../services/argumentsApi";
import { authManager } from "../stores/authManager";
import UserAvatar from "../components/ui/UserAvatar";
import { useVoting } from "../hooks/useVoting";
import { useDebateEnding } from "../hooks/useDebateEnding";
import { useOptimizedRefresh } from "../hooks/useOptimizedRefresh";
import VoteBar from "../components/features/voting/VoteBar";
import VoteButtons from "../components/features/voting/VoteButtons";

export default function DebatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [debateArguments, setDebateArguments] = useState([]);
  const [newArgument, setNewArgument] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingArgument, setIsSubmittingArgument] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // mm:ss remaining based on end_time
  // Removed isAutoRefreshing - now handled by useOptimizedRefresh

  // Voting hook
  const {
    votes,
    voteStatus,
    isLoading: isVoting,
    error: votingError,
    refreshVotes,
  } = useVoting(id, {
    autoLoad: true,
    autoRefresh: true,
    refreshInterval: 3000,
  });

  // Get user data for participants
  const user1 = debate?.user1_id
    ? usersStore.getUserForComponent(debate.user1_id)
    : null;
  const user2 = debate?.user2_id
    ? usersStore.getUserForComponent(debate.user2_id)
    : null;
  const currentUser = authManager.user;

  // Debate ending hook
  const { handleEndDebate, timeUntilAutoEnd, isAutoEndActive } =
    useDebateEnding(id, debate?.status, currentUser, user1, user2);

  // Auto scroll
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debateArguments]);

  // Real audience - get from debate participants and other users
  const audience = useMemo(() => {
    const audienceMembers = [];

    // Add debate participants
    if (user1) {
      audienceMembers.push({
        id: user1.id,
        firstName: user1.firstName,
        lastName: user1.lastName,
        avatarUrl: user1.avatarUrl,
      });
    }

    if (user2) {
      audienceMembers.push({
        id: user2.id,
        firstName: user2.firstName,
        lastName: user2.lastName,
        avatarUrl: user2.avatarUrl,
      });
    }

    // Add current user if not already in audience
    if (
      currentUser &&
      !audienceMembers.find((member) => member.id === currentUser.id)
    ) {
      audienceMembers.push({
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatarUrl: currentUser.avatarUrl,
      });
    }

    return audienceMembers;
  }, [user1, user2, currentUser]);

  // Vote bar calculation (now handled by centralized store)
  const totalVotes = votes?.total || 0;
  const user1Percent = votes?.user1Percent || 50;
  const user2Percent = votes?.user2Percent || 50;

  // Voting availability: allowed during live debates; throttled per user in store (20s cooldown)
  const canAudienceVote = debate?.status === "live";

  // Add argument with validation
  const handleAddArgument = useCallback(
    async (e) => {
      e.preventDefault();

      if (!currentUser) {
        alert("Please log in to add arguments");
        return;
      }

      // All authenticated users can add arguments
      // (Removed restriction to only debate participants)

      // Sanitize and validate input
      const sanitizedArgument = sanitizeInput(newArgument);
      const validation = validateArgument(sanitizedArgument);

      if (!validation.isValid) {
        // Show validation error (could be improved with toast notification)
        alert(validation.message);
        return;
      }

      setIsSubmittingArgument(true);
      try {
        // Save argument to server
        const newArgumentData = await createArgument(id, sanitizedArgument);

        // Add to local state with server data (includes author info)
        setDebateArguments((prev) => [...prev, newArgumentData]);
        setNewArgument("");
      } catch (error) {
        alert(error.message || "Failed to add argument");
      } finally {
        setIsSubmittingArgument(false);
      }
    },
    [newArgument, currentUser, id]
  );

  // Load debate data
  useEffect(() => {
    loadDebateData();
  }, [id]);

  // Vote handling is now done by the voting components

  // Optimized refresh function for debate data
  const refreshDebateData = useCallback(async () => {
    if (debate?.status !== "live") return;

    try {
          // Refresh debate data
          const debateData = await getDebate(id);
          if (debateData) {
            setDebate(debateData);

            // If debate status changed to finished, navigate to replay
            if (debateData.status === "finished") {
              navigate(`/replay/${id}`);
              return;
            }
          }

          // Refresh arguments
          const argumentsData = await getArgumentsForDebate(id);
          setDebateArguments(argumentsData || []);

          // Refresh votes (handled by voting hook)
          await refreshVotes();
    } catch (error) {}
  }, [id, debate?.status, refreshVotes, navigate]);

  // Optimized auto-refresh for live debates
  const { isRefreshing, error: refreshError } = useOptimizedRefresh(
    refreshDebateData,
    {
      interval: 4000, // 4 seconds for live debates (more frequent)
      enabled: debate?.status === "live", // Only for live debates
      immediate: false,
      maxRetries: 3,
      backoffMultiplier: 1.5,
      minInterval: 2000,
      maxInterval: 10000,
    }
  );

  const loadDebateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const debateData = await getDebate(id);
      if (!debateData) {
        setError("Debate not found");
        return;
      }

      setDebate(debateData);

      // Initialize countdown from server end_time if present
      if (debateData?.end_time) {
        const end = new Date(debateData.end_time).getTime();
        const now = Date.now();
        const remainingMs = Math.max(0, end - now);
        if (remainingMs === 0 && debateData.status === "live") {
          // If already past due, attempt to finish
          try { await finishDebateForUser(id, {}); } catch (_) {}
        }
        setTimeLeft(remainingMs);
      } else {
        setTimeLeft(null);
      }

      // Load arguments for the debate
      const argumentsData = await getArgumentsForDebate(id);
      setDebateArguments(argumentsData || []);

      // Voting data is now handled by the voting hook

      // Load user data for participants
      if (debateData.user1_id || debateData.user2_id) {
        await usersStore.loadUsersForDebates([debateData]);
      }
    } catch (err) {
      setError(err.message || "Failed to load debate");
    } finally {
      setLoading(false);
    }
  };

  // Countdown ticker
  useEffect(() => {
    if (!debate?.end_time || debate?.status !== "live") return;
    let rafId;
    const tick = () => {
      const endTs = new Date(debate.end_time).getTime();
      const remaining = Math.max(0, endTs - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) return; // stop; auto-finish handled below
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [debate?.end_time, debate?.status]);

  // Auto-finish when timer hits zero
  useEffect(() => {
    if (debate?.status !== "live") return;
    if (timeLeft === 0) {
      (async () => {
        try { await finishDebateForUser(id, {}); } catch (_) {}
        await refreshDebateData();
      })();
    }
  }, [timeLeft, debate?.status, id, refreshDebateData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debate...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // No debate found
  if (!debate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              {debate?.status === "live" && (
                <div className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-base font-semibold text-red-700">LIVE</span>
                  {typeof timeLeft === "number" && (
                    <span className="text-base font-mono text-red-600 bg-red-100 px-3 py-1 rounded-lg">
                      {(() => {
                        const totalSec = Math.ceil(timeLeft / 1000);
                        const mm = Math.floor(totalSec / 60).toString().padStart(2, "0");
                        const ss = (totalSec % 60).toString().padStart(2, "0");
                        return `${mm}:${ss}`;
                      })()}
                    </span>
                  )}
                </div>
              )}
              {debate?.status === "finished" && (
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-base font-semibold text-gray-700">FINISHED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Debate Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {debate.topic || "Debate Topic"}
          </h1>
        </div>

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
              {currentUser?.id === user1?.id && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  YOU
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-purple-700">{user1?.firstName || "User 1"}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full mx-auto mt-2"></div>
            </div>
            
            {/* Vote Button for User 1 */}
            <div className="mt-4 w-full">
              <VoteButtons
                debateId={id}
                user1Name={user1?.firstName || "User 1"}
                user2Name={user2?.firstName || "User 2"}
                canVote={canAudienceVote}
                showOnlyUser1={true}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200/50">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Live Discussion</h2>
              </div>
              
              <div className="h-96 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: "none" }}>
                <div ref={chatEndRef}></div>
                {debateArguments.length > 0 ? (
                  debateArguments
                    .slice()
                    .reverse()
                    .map((argument) => (
                      <div
                        key={argument.id}
                        className={`flex items-start gap-3 ${
                          argument.author?.id === user1?.id ? "justify-start" : "justify-end"
                        }`}
                      >
                        {argument.author?.id === user1?.id && (
                          <div className="flex items-start gap-3 max-w-md">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {argument.author?.firstName?.charAt(0) || "U"}
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-purple-200">
                              <div className="text-xs font-semibold text-purple-700 mb-1">
                                {argument.author?.firstName || "User"}
                              </div>
                              <div className="text-gray-800 text-sm leading-relaxed">{argument.text}</div>
                            </div>
                          </div>
                        )}
                        {argument.author?.id === user2?.id && (
                          <div className="flex items-start gap-3 max-w-md flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {argument.author?.firstName?.charAt(0) || "U"}
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-blue-200">
                              <div className="text-xs font-semibold text-blue-700 mb-1 text-right">
                                {argument.author?.firstName || "User"}
                              </div>
                              <div className="text-gray-800 text-sm leading-relaxed text-right">{argument.text}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No arguments yet. Start the discussion!</p>
                  </div>
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
              {currentUser?.id === user2?.id && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  YOU
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-blue-700">{user2?.firstName || "User 2"}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto mt-2"></div>
            </div>
            
            {/* Vote Button for User 2 */}
            <div className="mt-4 w-full">
              <VoteButtons
                debateId={id}
                user1Name={user1?.firstName || "User 1"}
                user2Name={user2?.firstName || "User 2"}
                canVote={canAudienceVote}
                showOnlyUser2={true}
              />
            </div>
          </div>
        </div>

        {/* Input Area */}
        {currentUser && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-6">
            <form onSubmit={handleAddArgument} className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newArgument}
                  onChange={(e) => setNewArgument(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmittingArgument}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isSubmittingArgument ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </form>

            {/* End Debate Button */}
            {debate?.status === "live" && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleEndDebate}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  End Debate
                </button>
              </div>
            )}

            {/* Debate Ended Message */}
            {debate?.status === "finished" && (
              <div className="flex justify-center mt-4">
                <div className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Debate Ended
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vote Bar */}
        <div className="pointer-events-none select-none">
          <VoteBar
            debateId={id}
            user1Name={user1?.firstName || "User 1"}
            user2Name={user2?.firstName || "User 2"}
          />
        </div>
      </div>
    </div>
  );
}
