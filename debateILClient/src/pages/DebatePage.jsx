import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateArgument, sanitizeInput } from "../utils/validators";
import { getDebate } from "../stores/usersStore";
import {
  getArgumentsForDebate,
  createArgument,
} from "../services/argumentsApi";
import { authStore } from "../stores/authStore";
import { usersStore } from "../stores/usersStore";
import UserAvatar from "../components/ui/UserAvatar";
import { useVoting } from "../hooks/useVoting";
import VoteBar from "../components/features/voting/VoteBar";
import VoteButtons from "../components/features/voting/VoteButtons";
import AudienceDisplay from "../components/features/voting/AudienceDisplay";

export default function DebatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [debateArguments, setDebateArguments] = useState([]);
  const [newArgument, setNewArgument] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingArgument, setIsSubmittingArgument] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

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

  // Load debate data
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

      setDebate(debateData);

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

  // Auto scroll
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debateArguments]);

  // Auto refresh every 3 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Only refresh if debate is live
        if (debate?.status === "live") {
          setIsAutoRefreshing(true);

          // Refresh arguments
          const argumentsData = await getArgumentsForDebate(id);
          setDebateArguments(argumentsData || []);

          // Refresh votes (handled by voting hook)
          await refreshVotes();

          setIsAutoRefreshing(false);
        }
      } catch (error) {
        // Silent fail for auto-refresh
        console.log("Auto-refresh failed:", error.message);
        setIsAutoRefreshing(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, debate?.status, refreshVotes]);

  // Get user data for participants
  const user1 = debate?.user1_id
    ? usersStore.getUserForComponent(debate.user1_id)
    : null;
  const user2 = debate?.user2_id
    ? usersStore.getUserForComponent(debate.user2_id)
    : null;
  const currentUser = authStore.activeUser;

  // Mock audience for now (could be loaded from server in the future)
  const audience = [
    { id: 101, avatar: "" },
    { id: 102, avatar: "" },
    { id: 103, avatar: "" },
    { id: 104, avatar: "" },
    { id: 105, avatar: "" },
  ];

  // Vote bar calculation (now handled by voting store)
  const totalVotes = votes?.total || 0;
  const user1Percent = votes?.user1Percent || 50;
  const user2Percent = votes?.user2Percent || 50;

  // Add argument with validation
  const handleAddArgument = useCallback(
    async (e) => {
      e.preventDefault();

      if (!currentUser) {
        alert("Please log in to add arguments");
        return;
      }

      // Only debate participants can add arguments
      if (currentUser.id !== user1?.id && currentUser.id !== user2?.id) {
        alert("Only debate participants can add arguments");
        return;
      }

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

  // Vote handling is now done by the voting components

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
    <div className="h-screen bg-gradient-to-b from-blue-100 to-gray-100 overflow-hidden flex flex-col">
      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-2 pb-1">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>

      {/* Vote Bar */}
      <VoteBar
        debateId={id}
        user1Name={user1?.firstName || "User 1"}
        user2Name={user2?.firstName || "User 2"}
      />

      {/* Debaters Avatars - OUTSIDE the ring */}
      <div className="w-full max-w-4xl mx-auto flex flex-row justify-between items-center px-4 mb-2">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white border-4 sm:border-6 md:border-8 border-blue-700 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl shadow-2xl ring-2 sm:ring-3 md:ring-4 ring-blue-200 overflow-hidden">
              {user1?.avatarUrl ? (
                <img
                  src={user1.avatarUrl}
                  alt="user1"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : user1 ? (
                <UserAvatar user={user1} size="2xl" className="w-full h-full" />
              ) : (
                <span className="text-blue-300">+</span>
              )}
            </div>
            {/* Participant indicator for user1 */}
            {currentUser?.id === user1?.id && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                YOU
              </div>
            )}
          </div>
          <div className="text-center font-extrabold text-blue-700 text-sm sm:text-base md:text-lg tracking-wide drop-shadow-lg mt-1">
            {user1?.firstName || "User 1"}
            {currentUser?.id === user1?.id && (
              <span className="block text-xs text-green-600 font-normal">
                (You)
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white border-4 sm:border-6 md:border-8 border-red-700 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl shadow-2xl ring-2 sm:ring-3 md:ring-4 ring-red-200 overflow-hidden">
              {user2?.avatarUrl ? (
                <img
                  src={user2.avatarUrl}
                  alt="user2"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : user2 ? (
                <UserAvatar user={user2} size="2xl" className="w-full h-full" />
              ) : (
                <span className="text-red-300">+</span>
              )}
            </div>
            {/* Participant indicator for user2 */}
            {currentUser?.id === user2?.id && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                YOU
              </div>
            )}
          </div>
          <div className="text-center font-extrabold text-red-700 text-sm sm:text-base md:text-lg tracking-wide drop-shadow-lg mt-1">
            {user2?.firstName || "User 2"}
            {currentUser?.id === user2?.id && (
              <span className="block text-xs text-green-600 font-normal">
                (You)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Debate Title */}
      <div className="w-full max-w-4xl mx-auto text-center mb-2 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {debate.topic || "Debate Topic"}
          </h1>
          {debate?.status === "live" && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {isAutoRefreshing ? "Updating..." : "Live"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Debate Arena */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col min-h-0">
        {/* Boxing ring frame */}
        <div
          className="w-full flex flex-col items-center justify-center py-3 px-2 flex-1"
          style={{
            border: "4px solid #222",
            borderRadius: "1.5rem",
            boxShadow: "0 0 0 4px #e0e7ef, 0 4px 16px 0 rgba(0,0,0,0.10)",
            background: "linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)",
            position: "relative",
            overflow: "hidden",
            minHeight: "200px",
          }}
        >
          {/* Chat Area */}
          <div className="relative w-full flex flex-col items-center h-full">
            <div
              className="flex flex-col-reverse overflow-y-auto w-full h-full px-2 py-2"
              style={{
                scrollbarWidth: "none",
                background: "transparent",
                minWidth: "200px",
                maxHeight: "250px",
              }}
            >
              <div ref={chatEndRef}></div>
              {debateArguments.length > 0 ? (
                debateArguments
                  .slice()
                  .reverse()
                  .map((argument) => (
                    <div
                      key={argument.id}
                      className={`flex items-end mb-4 ${
                        argument.author?.id === user1?.id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {/* Bubble + Avatar */}
                      {argument.author?.id === user1?.id && (
                        <>
                          <div className="flex items-end">
                            <div className="rounded-2xl bg-blue-100 px-3 py-2 sm:px-4 sm:py-3 shadow text-left max-w-xs mr-2 text-sm sm:text-base border-2 border-blue-300 text-blue-900 font-semibold">
                              <div className="mb-1 text-blue-700 font-bold text-xs sm:text-sm">
                                {argument.author?.firstName || "User"}
                              </div>
                              <div className="break-words">{argument.text}</div>
                            </div>
                          </div>
                        </>
                      )}
                      {argument.author?.id === user2?.id && (
                        <>
                          <div className="rounded-2xl bg-red-100 px-3 py-2 sm:px-4 sm:py-3 shadow text-right max-w-xs ml-2 text-sm sm:text-base border-2 border-red-300 text-red-900 font-semibold">
                            <div className="mb-1 text-red-700 font-bold text-xs sm:text-sm">
                              {argument.author?.firstName || "User"}
                            </div>
                            <div className="break-words">{argument.text}</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No arguments yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input box BELOW the ring - Only for debate participants */}
      {(currentUser?.id === user1?.id || currentUser?.id === user2?.id) && (
        <div className="w-full max-w-4xl mx-auto px-4 py-2">
          <form
            onSubmit={handleAddArgument}
            className="flex flex-col sm:flex-row items-center justify-center gap-2"
          >
            <input
              type="text"
              value={newArgument}
              onChange={(e) => setNewArgument(e.target.value)}
              placeholder="Type your argument..."
              className={`flex-1 px-4 py-2 sm:px-5 sm:py-3 border-2 rounded-full text-sm sm:text-base shadow-lg bg-white focus:outline-none ${
                currentUser?.id === user1?.id
                  ? "border-blue-700 focus:ring-2 focus:ring-blue-400"
                  : "border-red-700 focus:ring-2 focus:ring-red-400"
              }`}
              style={{ maxWidth: 500 }}
            />
            <button
              type="submit"
              disabled={isSubmittingArgument}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-extrabold text-sm sm:text-base shadow ${
                currentUser?.id === user1?.id
                  ? "bg-blue-700 text-white hover:bg-blue-900"
                  : "bg-red-700 text-white hover:bg-red-900"
              } transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto`}
            >
              {isSubmittingArgument ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}

      {/* Audience & Voting */}
      <AudienceDisplay audience={audience} />
      <VoteButtons
        debateId={id}
        user1Name={user1?.firstName || "User 1"}
        user2Name={user2?.firstName || "User 2"}
      />
    </div>
  );
}
