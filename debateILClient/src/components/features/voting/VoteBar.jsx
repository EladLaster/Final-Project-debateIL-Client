import React from "react";
import { observer } from "mobx-react-lite";
import { votingStore } from "../../../stores/votingStore";

/**
 * VoteBar Component
 * Displays the voting progress bar with percentages
 */
const VoteBar = observer(
  ({ debateId, user1Name = "User 1", user2Name = "User 2" }) => {
    const votes = votingStore.getVotesForDebate(debateId);
    const isLoading = votingStore.isLoading(debateId);

    return (
      <div className="w-full max-w-4xl mx-auto mt-2 mb-1 px-4">
        <div className="flex h-8 rounded-full overflow-hidden shadow-2xl border-2 border-gray-300 relative">
          {/* User 1 votes */}
          <div
            className="flex items-center justify-end pr-2 text-white font-extrabold text-sm bg-blue-700 transition-all duration-500"
            style={{ width: `${votes.user1Percent}%` }}
          >
            {isLoading ? (
              <div className="animate-pulse text-xs">Loading...</div>
            ) : (
              `${votes.user1Percent}% ${user1Name}`
            )}
          </div>

          {/* User 2 votes */}
          <div
            className="flex items-center justify-start pl-2 text-white font-extrabold text-sm bg-red-700 transition-all duration-500"
            style={{ width: `${votes.user2Percent}%` }}
          >
            {isLoading ? (
              <div className="animate-pulse text-xs">Loading...</div>
            ) : (
              `${votes.user2Percent}% ${user2Name}`
            )}
          </div>
        </div>

        {/* Vote counts */}
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>
            {user1Name}: {votes.user1}
          </span>
          <span>Total: {votes.total}</span>
          <span>
            {user2Name}: {votes.user2}
          </span>
        </div>
      </div>
    );
  }
);

export default VoteBar;
