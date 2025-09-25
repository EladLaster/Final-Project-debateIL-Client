import { observer } from "mobx-react-lite";
import { useState } from "react";
import { votingStore } from "../../../stores/votingStore";

/**
 * VoteButtons Component
 * Displays voting buttons for audience members
 */
const VoteButtons = observer(
  ({ debateId, user1Name = "User 1", user2Name = "User 2", onVoteSuccess, canVote = true }) => {
    const voteStatus = votingStore.getUserVoteStatus(debateId);
    const isLoading = votingStore.isLoading(debateId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const error = votingStore.getError(debateId);

    const handleVote = async (userSide) => {
      try {
        setIsSubmitting(true);
        await votingStore.voteForDebate(debateId, userSide);
        if (onVoteSuccess) {
          onVoteSuccess(userSide);
        }
      } catch (error) {
        // Error is already handled by the store
      } finally {
        setIsSubmitting(false);
      }
    };

    if (false && voteStatus.hasVoted) {
      return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-1 pb-2 px-4">
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-2 text-center">
            <div className="text-green-800 font-semibold text-sm mb-1">
              ✅ Vote Submitted!
            </div>
            <div className="text-green-700 text-xs">
              You voted for{" "}
              {voteStatus.votedFor === "user1" ? user1Name : user2Name}
            </div>
          </div>
        </div>
      );
    }

    const disabledByCadence = !canVote;
    const now = Date.now();
    const remainingMs = voteStatus?.lastVoteAt ? Math.max(0, 20000 - (now - voteStatus.lastVoteAt)) : 0;
    const timeGated = remainingMs > 0;
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-1 pb-2 px-4">
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-2 mb-2 text-center">
            <div className="text-red-800 font-semibold text-sm">
              ❌ Vote Failed: {error}
            </div>
          </div>
        )}

        {!canVote && (
          <div className="text-xs text-gray-600 mb-1">Voting available when debate is live.</div>
        )}
        {canVote && timeGated && (
          <div className="text-xs text-gray-600 mb-1">You can vote again in {Math.ceil(remainingMs/1000)}s.</div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
          <button
            onClick={() => handleVote("user1")}
            disabled={isSubmitting || disabledByCadence || timeGated}
            className="bg-blue-700 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-lg hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSubmitting ? "Voting..." : `Vote ${user1Name}`}
          </button>
          <button
            onClick={() => handleVote("user2")}
            disabled={isSubmitting || disabledByCadence || timeGated}
            className="bg-red-700 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-lg hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSubmitting ? "Voting..." : `Vote ${user2Name}`}
          </button>
        </div>
      </div>
    );
  }
);

export default VoteButtons;
