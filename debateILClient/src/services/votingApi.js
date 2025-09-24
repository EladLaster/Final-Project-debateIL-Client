import axios from "axios";
import { APP_CONFIG } from "../utils/constants";
import { handleApiError } from "../utils/errorHandler";

// API configuration
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true,
});

// Error handling utility
const normalizeError = (error, context = {}) => {
  const friendlyError = handleApiError(error, context);
  return new Error(friendlyError.message);
};

/**
 * Voting API Service
 * Handles all voting-related operations
 */

/**
 * Vote for user1 in a debate
 * @param {string|number} debateId - The debate ID
 * @returns {Promise<Object>} Updated debate with new scores
 */
export async function voteForUser1(debateId) {
  try {
    const { data } = await api.patch(
      `/api/debates/${debateId}/vote/user1`,
      {}
      // { withCredentials: true }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to vote for user1");
    }

    // Save voting status to localStorage
    const voteKey = `voted_${debateId}`;
    localStorage.setItem(voteKey, "true");

    return data?.debate;
  } catch (error) {
    throw normalizeError(error, {
      action: "voteForUser1",
      component: "VotingAPI",
      data: { debateId },
    });
  }
}

/**
 * Vote for user2 in a debate
 * @param {string|number} debateId - The debate ID
 * @returns {Promise<Object>} Updated debate with new scores
 */
export async function voteForUser2(debateId) {
  try {
    const { data } = await api.patch(
      `/api/debates/${debateId}/vote/user2`,
      {}
      // { withCredentials: true }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to vote for user2");
    }

    // Save voting status to localStorage
    const voteKey = `voted_${debateId}`;
    localStorage.setItem(voteKey, "true");

    return data?.debate;
  } catch (error) {
    throw normalizeError(error, {
      action: "voteForUser2",
      component: "VotingAPI",
      data: { debateId },
    });
  }
}

/**
 * Get current vote results for a debate
 * @param {string|number} debateId - The debate ID
 * @returns {Promise<Object>} Vote results
 */
export async function getVoteResults(debateId) {
  try {
    const { data } = await api.get(`/api/debates/${debateId}/votes`, {
      // withCredentials: true,
    });

    if (data?.success === false) {
      return { user1Votes: 0, user2Votes: 0, totalVotes: 0 };
    }

    const scores = data?.scores;
    if (!scores) {
      return { user1Votes: 0, user2Votes: 0, totalVotes: 0 };
    }

    const user1Votes = scores.score_user1 || 0;
    const user2Votes = scores.score_user2 || 0;
    const totalVotes = user1Votes + user2Votes;

    // Calculate percentages with proper edge case handling
    let user1Percentage = 50;
    let user2Percentage = 50;

    if (totalVotes > 0) {
      if (user1Votes > 0 && user2Votes === 0) {
        user1Percentage = 100;
        user2Percentage = 0;
      } else if (user1Votes === 0 && user2Votes > 0) {
        user1Percentage = 0;
        user2Percentage = 100;
      } else {
        user1Percentage = Math.round((user1Votes / totalVotes) * 100);
        user2Percentage = Math.round((user2Votes / totalVotes) * 100);
      }
    }

    return {
      user1Votes,
      user2Votes,
      totalVotes,
      user1Percentage,
      user2Percentage,
    };
  } catch (error) {
    // Return default values if endpoint doesn't exist or fails
    return { user1Votes: 0, user2Votes: 0, totalVotes: 0 };
  }
}

/**
 * Generic vote function that accepts user side
 * @param {string|number} debateId - The debate ID
 * @param {string} userSide - Either 'user1' or 'user2'
 * @returns {Promise<Object>} Updated debate with new scores
 */
export async function voteForUser(debateId, userSide) {
  if (userSide === "user1") {
    return voteForUser1(debateId);
  } else if (userSide === "user2") {
    return voteForUser2(debateId);
  } else {
    throw new Error("Invalid user side. Must be 'user1' or 'user2'");
  }
}

// Export the API instance for advanced usage
export { api as votingApi };
