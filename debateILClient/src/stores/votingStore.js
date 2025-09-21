import { makeAutoObservable } from "mobx";
import {
  voteForUser,
  getVoteResults,
  hasUserVoted as checkUserVoted,
} from "../services/votingApi";

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
  userVotes = {}; // { debateId: { hasVoted: false, votedFor: null } }
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

      this.setVotes(debateId, {
        user1: results.user1Votes || 0,
        user2: results.user2Votes || 0,
        total: results.totalVotes || 0,
        user1Percent: results.user1Percentage || 50,
        user2Percent: results.user2Percentage || 50,
      });

      // Check if user has voted
      const hasVoted = await checkUserVoted(debateId);
      this.setUserVotes(debateId, {
        hasVoted,
        votedFor: hasVoted ? this.userVotes[debateId]?.votedFor : null,
      });
    } catch (error) {
      this.setError(debateId, error.message);
      console.error("Failed to load vote results:", error);
    } finally {
      this.setLoading(debateId, false);
    }
  }

  async voteForDebate(debateId, userSide) {
    if (this.getUserVoteStatus(debateId).hasVoted) {
      throw new Error("You have already voted in this debate");
    }

    this.setLoading(debateId, true);
    this.setError(debateId, null);

    try {
      const updatedDebate = await voteForUser(debateId, userSide);

      // Update votes
      this.setVotes(debateId, {
        user1: updatedDebate.score_user1 || 0,
        user2: updatedDebate.score_user2 || 0,
        total:
          (updatedDebate.score_user1 || 0) + (updatedDebate.score_user2 || 0),
        user1Percent: this.calculatePercentage(
          updatedDebate.score_user1 || 0,
          updatedDebate.score_user2 || 0,
          0
        ),
        user2Percent: this.calculatePercentage(
          updatedDebate.score_user2 || 0,
          updatedDebate.score_user1 || 0,
          1
        ),
      });

      // Update user vote status
      this.setUserVotes(debateId, {
        hasVoted: true,
        votedFor: userSide,
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
  calculatePercentage(votes, otherVotes, fallback) {
    const total = votes + otherVotes;
    if (total === 0) {
      return 50; // Default to 50% when no votes
    }

    // Handle edge cases for 100% and 0%
    if (votes > 0 && otherVotes === 0) {
      return 100;
    } else if (votes === 0 && otherVotes > 0) {
      return 0;
    }

    // Calculate normal percentage
    const percentage = Math.round((votes / total) * 100);
    return Math.max(0, Math.min(100, percentage)); // Ensure between 0-100
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
