import { useEffect, useCallback } from "react";
import { votingStore } from "../stores/votingStore";
import { useOptimizedRefresh } from "./useOptimizedRefresh";

/**
 * useVoting Hook
 * Provides voting functionality and state management
 */
export const useVoting = (debateId, options = {}) => {
  const {
    autoLoad = true,
    autoRefresh = false,
    refreshInterval = 3000,
  } = options;

  // Load vote results on mount
  useEffect(() => {
    if (autoLoad && debateId) {
      votingStore.loadVoteResults(debateId);
    }
  }, [debateId, autoLoad]);

  // Optimized auto refresh votes
  const { isRefreshing: isVotesRefreshing } = useOptimizedRefresh(
    () => votingStore.refreshVoteResults(debateId),
    {
      interval: refreshInterval,
      enabled: autoRefresh && !!debateId,
      immediate: false,
      maxRetries: 2,
      backoffMultiplier: 1.5,
      minInterval: 2000,
      maxInterval: 15000,
    }
  );

  // Vote for a user
  const vote = useCallback(
    async (userSide) => {
      if (!debateId) {
        throw new Error("Debate ID is required");
      }
      return await votingStore.voteForDebate(debateId, userSide);
    },
    [debateId]
  );

  // Refresh vote results
  const refreshVotes = useCallback(() => {
    if (!debateId) return;
    return votingStore.refreshVoteResults(debateId);
  }, [debateId]);

  // Get current vote data
  const getVoteData = useCallback(() => {
    if (!debateId) return null;
    return {
      votes: votingStore.getVotesForDebate(debateId),
      voteStatus: votingStore.getUserVoteStatus(debateId),
      isLoading: votingStore.isLoading(debateId),
      error: votingStore.getError(debateId),
    };
  }, [debateId]);

  // Clear voting data
  const clearVotingData = useCallback(() => {
    if (debateId) {
      votingStore.clearDebateData(debateId);
    }
  }, [debateId]);

  return {
    vote,
    refreshVotes,
    getVoteData,
    clearVotingData,
    // Direct access to store data
    votes: debateId ? votingStore.getVotesForDebate(debateId) : null,
    voteStatus: debateId ? votingStore.getUserVoteStatus(debateId) : null,
    isLoading: debateId ? votingStore.isLoading(debateId) : false,
    error: debateId ? votingStore.getError(debateId) : null,
    isRefreshing: isVotesRefreshing,
  };
};

export default useVoting;
