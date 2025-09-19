// Statistics calculation utilities

/**
 * Calculate user statistics from debates data
 * @param {Object} user - User object with id
 * @param {Array} debates - Array of all debates
 * @returns {Object} Calculated statistics
 */
export function calculateUserStatistics(user, debates = []) {
  if (!user?.id) {
    return getEmptyStats();
  }

  // Filter debates where user participated
  const userDebates = debates.filter(
    (debate) => debate.user1_id === user.id || debate.user2_id === user.id
  );

  // Filter finished debates only
  const finishedDebates = userDebates.filter(
    (debate) => debate.status === "finished"
  );

  // Calculate wins
  const wonDebates = finishedDebates.filter((debate) => {
    if (debate.user1_id === user.id) {
      return (debate.score_user1 || 0) > (debate.score_user2 || 0);
    } else {
      return (debate.score_user2 || 0) > (debate.score_user1 || 0);
    }
  });

  // Calculate win rate
  const winRate =
    finishedDebates.length > 0
      ? Math.round((wonDebates.length / finishedDebates.length) * 100)
      : 0;

  // Calculate total and average score
  const totalScore = finishedDebates.reduce((sum, debate) => {
    if (debate.user1_id === user.id) {
      return sum + (debate.score_user1 || 0);
    } else {
      return sum + (debate.score_user2 || 0);
    }
  }, 0);

  const averageScore =
    finishedDebates.length > 0
      ? Math.round(totalScore / finishedDebates.length)
      : 0;

  return {
    totalDebates: userDebates.length,
    finishedDebates: finishedDebates.length,
    wins: wonDebates.length,
    losses: finishedDebates.length - wonDebates.length,
    winRate,
    totalScore,
    averageScore,
    currentStreak: calculateCurrentStreak(userDebates, user.id),
    bestScore: calculateBestScore(finishedDebates, user.id),
    worstScore: calculateWorstScore(finishedDebates, user.id),
  };
}

/**
 * Calculate current win/loss streak
 * @param {Array} userDebates - User's debates ordered by date
 * @param {string} userId - User ID
 * @returns {Object} Streak information
 */
function calculateCurrentStreak(userDebates, userId) {
  // Sort debates by date (most recent first)
  const sortedDebates = [...userDebates]
    .filter((debate) => debate.status === "finished")
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt) -
        new Date(a.createdAt || a.updatedAt)
    );

  if (sortedDebates.length === 0) {
    return { type: "none", count: 0 };
  }

  let streakCount = 0;
  let streakType = null;

  for (const debate of sortedDebates) {
    const isWin =
      (debate.user1_id === userId &&
        (debate.score_user1 || 0) > (debate.score_user2 || 0)) ||
      (debate.user2_id === userId &&
        (debate.score_user2 || 0) > (debate.score_user1 || 0));

    if (streakType === null) {
      streakType = isWin ? "win" : "loss";
      streakCount = 1;
    } else if (
      (streakType === "win" && isWin) ||
      (streakType === "loss" && !isWin)
    ) {
      streakCount++;
    } else {
      break;
    }
  }

  return { type: streakType, count: streakCount };
}

/**
 * Calculate best score achieved
 * @param {Array} finishedDebates - Finished debates
 * @param {string} userId - User ID
 * @returns {number} Best score
 */
function calculateBestScore(finishedDebates, userId) {
  const scores = finishedDebates.map((debate) => {
    if (debate.user1_id === userId) {
      return debate.score_user1 || 0;
    } else {
      return debate.score_user2 || 0;
    }
  });

  return scores.length > 0 ? Math.max(...scores) : 0;
}

/**
 * Calculate worst score achieved
 * @param {Array} finishedDebates - Finished debates
 * @param {string} userId - User ID
 * @returns {number} Worst score
 */
function calculateWorstScore(finishedDebates, userId) {
  const scores = finishedDebates.map((debate) => {
    if (debate.user1_id === userId) {
      return debate.score_user1 || 0;
    } else {
      return debate.score_user2 || 0;
    }
  });

  return scores.length > 0 ? Math.min(...scores) : 0;
}

/**
 * Get empty statistics object
 * @returns {Object} Empty stats
 */
function getEmptyStats() {
  return {
    totalDebates: 0,
    finishedDebates: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalScore: 0,
    averageScore: 0,
    currentStreak: { type: "none", count: 0 },
    bestScore: 0,
    worstScore: 0,
  };
}

/**
 * Calculate achievements based on statistics
 * @param {Object} stats - User statistics
 * @returns {Array} Array of achievements
 */
export function calculateAchievements(stats) {
  return [
    {
      id: "first_debate",
      title: "First Debate",
      description: "Participated in your first debate",
      icon: "🎯",
      earned: stats.totalDebates > 0,
      progress: Math.min(stats.totalDebates, 1),
      target: 1,
    },
    {
      id: "debate_master",
      title: "Debate Master",
      description: "Won 5 debates",
      icon: "👑",
      earned: stats.wins >= 5,
      progress: Math.min(stats.wins, 5),
      target: 5,
    },
    {
      id: "high_scorer",
      title: "High Scorer",
      description: "Average score above 80",
      icon: "⭐",
      earned: stats.averageScore >= 80,
      progress: Math.min(stats.averageScore, 80),
      target: 80,
    },
    {
      id: "active_debater",
      title: "Active Debater",
      description: "Participated in 10 debates",
      icon: "💬",
      earned: stats.totalDebates >= 10,
      progress: Math.min(stats.totalDebates, 10),
      target: 10,
    },
    {
      id: "winning_streak",
      title: "Winning Streak",
      description: "5 wins in a row",
      icon: "🔥",
      earned:
        stats.currentStreak.type === "win" && stats.currentStreak.count >= 5,
      progress:
        stats.currentStreak.type === "win"
          ? Math.min(stats.currentStreak.count, 5)
          : 0,
      target: 5,
    },
    {
      id: "perfect_score",
      title: "Perfect Score",
      description: "Achieved a perfect score (100)",
      icon: "💯",
      earned: stats.bestScore >= 100,
      progress: Math.min(stats.bestScore, 100),
      target: 100,
    },
  ];
}

/**
 * Format statistics for display
 * @param {Object} stats - Raw statistics
 * @returns {Array} Formatted stats for UI
 */
export function formatStatsForDisplay(stats) {
  return [
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      icon: "🏆",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Average Score",
      value: stats.averageScore.toString(),
      icon: "📊",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Debates",
      value: stats.totalDebates.toString(),
      icon: "💬",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Wins",
      value: stats.wins.toString(),
      icon: "🥇",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];
}

