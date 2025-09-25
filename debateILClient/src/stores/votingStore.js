import { makeAutoObservable } from "mobx";
import { voteForUser, getVoteResults } from "../services/votingApi";

/**
 * Voting Store
 * Manages voting state and operations for debates
 */
class VotingStore {
  constructor() {
    makeAutoObservable(this);
  }

  // State
  votes = {}; // { debateId: { user1: 0, user2: 0, total: 0, user1Percent: 50, user2Percent: 50 } }
  userVotes = {}; // { debateId: { hasVoted: false, votedFor: null, lastVoteAt: 0 } }
  loading = {}; // { debateId: false }
  errors = {}; // { debateId: null }

  // Getters
  getVotesForDebate(debateId) {
    return (
      this.votes[debateId] || {
        user1: 0,
        user2: 0,
        total: 0,
        user1Percent: 50,
        user2Percent: 50,
      }
    );
  }

  getUserVoteStatus(debateId) {
    return (
      this.userVotes[debateId] || {
        hasVoted: false,
        votedFor: null,
        lastVoteAt: 0,
      }
    );
  }

  isLoading(debateId) {
    return this.loading[debateId] || false;
  }

  getError(debateId) {
    return this.errors[debateId] || null;
  }

  // Actions
  async loadVoteResults(debateId) {
    this.setLoading(debateId, true);
    this.setError(debateId, null);

    try {
      const results = await getVoteResults(debateId);

      const user1Votes = results.user1Votes || 0;
      const user2Votes = results.user2Votes || 0;
      const percentages = this.calculatePercentages(user1Votes, user2Votes);

      this.setVotes(debateId, {
        user1: user1Votes,
        user2: user2Votes,
        total: user1Votes + user2Votes,
        user1Percent: percentages.user1Percent,
        user2Percent: percentages.user2Percent,
      });

      // Load last vote time so we can throttle by 20 seconds per user
      const timeKey = `vote_time_${debateId}`;
      const timeRaw = localStorage.getItem(timeKey);
      const lastVoteAt = timeRaw ? Number(timeRaw) : 0;
      this.setUserVotes(debateId, {
        hasVoted: false,
        votedFor: this.userVotes[debateId]?.votedFor || null,
        lastVoteAt,
      });
    } catch (error) {
      this.setError(debateId, error.message);
    } finally {
      this.setLoading(debateId, false);
    }
  }

  async voteForDebate(debateId, userSide) {
    // Enforce 20s cooldown locally
    const status = this.getUserVoteStatus(debateId);
    const now = Date.now();
    if (status.lastVoteAt && now - status.lastVoteAt < 20000) {
      const remaining = Math.ceil((20000 - (now - status.lastVoteAt)) / 1000);
      throw new Error(`Please wait ${remaining}s before voting again`);
    }
    this.setLoading(debateId, true);
    this.setError(debateId, null);

    try {
      const updatedDebate = await voteForUser(debateId, userSide);

      // Update votes
      const user1Votes = updatedDebate.score_user1 || 0;
      const user2Votes = updatedDebate.score_user2 || 0;
      const percentages = this.calculatePercentages(user1Votes, user2Votes);

      this.setVotes(debateId, {
        user1: user1Votes,
        user2: user2Votes,
        total: user1Votes + user2Votes,
        user1Percent: percentages.user1Percent,
        user2Percent: percentages.user2Percent,
      });

      // Update user vote status and store last vote time
      const timeKey = `vote_time_${debateId}`;
      const nowTs = Date.now();
      localStorage.setItem(timeKey, String(nowTs));
      this.setUserVotes(debateId, {
        hasVoted: false,
        votedFor: userSide,
        lastVoteAt: nowTs,
      });

      return updatedDebate;
    } catch (error) {
      this.setError(debateId, error.message);
      throw error;
    } finally {
      this.setLoading(debateId, false);
    }
  }

  async refreshVoteResults(debateId) {
    await this.loadVoteResults(debateId);
  }

  // Helper methods
  calculatePercentage(votes, otherVotes) {
    const total = votes + otherVotes;
    if (total === 0) {
      return 50; // Default to 50% when no votes
    }

    // Calculate normal percentage
    const percentage = Math.round((votes / total) * 100);
    return Math.max(0, Math.min(100, percentage)); // Ensure between 0-100
  }

  // Calculate both percentages to ensure they sum to 100%
  calculatePercentages(user1Votes, user2Votes) {
    const total = user1Votes + user2Votes;
    if (total === 0) {
      return { user1Percent: 50, user2Percent: 50 };
    }

    const user1Percent = Math.round((user1Votes / total) * 100);
    const user2Percent = 100 - user1Percent; // Ensure they sum to 100%

    return {
      user1Percent: Math.max(0, Math.min(100, user1Percent)),
      user2Percent: Math.max(0, Math.min(100, user2Percent)),
    };
  }

  setLoading(debateId, loading) {
    this.loading[debateId] = loading;
  }

  setError(debateId, error) {
    this.errors[debateId] = error;
  }

  setVotes(debateId, votes) {
    this.votes[debateId] = votes;
  }

  setUserVotes(debateId, userVotes) {
    this.userVotes[debateId] = userVotes;
  }

  // Clear data for a specific debate
  clearDebateData(debateId) {
    delete this.votes[debateId];
    delete this.userVotes[debateId];
    delete this.loading[debateId];
    delete this.errors[debateId];
  }

  // Clear all data
  clearAll() {
    this.votes = {};
    this.userVotes = {};
    this.loading = {};
    this.errors = {};
  }
}

// Create and export singleton instance
export const votingStore = new VotingStore();
export default votingStore;
