import { observer } from "mobx-react-lite";
import { votingStore } from "../../../stores/votingStore";

/**
 * VoteBar Component
 * Displays the voting progress bar with percentages
 */
const VoteBar = observer(
  ({ debateId, user1Name = "User 1", user2Name = "User 2" }) => {
    const votes = votingStore.getVotesForDebate(debateId);
    const isLoading = false; // suppress loading flashes for smoother UX

    return (
      <div className="w-full max-w-4xl mx-auto mt-2 mb-1 px-4">
        <div className="flex h-6 lg:h-8 rounded-full overflow-hidden shadow-2xl border-2 border-gray-300 relative">
          {/* User 1 votes */}
          <div
            className="bg-blue-700 transition-all duration-500"
            style={{
              width: `${Math.max(votes.user1Percent, 0)}%`,
              minWidth: votes.user1Percent > 0 ? "20px" : "0px",
            }}
          ></div>

          {/* User 2 votes */}
          <div
            className="bg-red-700 transition-all duration-500"
            style={{
              width: `${Math.max(votes.user2Percent, 0)}%`,
              minWidth: votes.user2Percent > 0 ? "20px" : "0px",
            }}
          ></div>
        </div>

        {/* Percentage labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span className="font-semibold text-blue-700 text-xs lg:text-sm">{`${votes.user1Percent}% ${user1Name}`}</span>
          <span className="font-semibold text-red-700 text-xs lg:text-sm">{`${votes.user2Percent}% ${user2Name}`}</span>
        </div>

        {/* Vote counts */}
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span className="text-xs lg:text-sm">
            {user1Name}: {votes.user1}
          </span>
          <span className="text-xs lg:text-sm">Total: {votes.total}</span>
          <span className="text-xs lg:text-sm">
            {user2Name}: {votes.user2}
          </span>
        </div>
      </div>
    );
  }
);

export default VoteBar;
