// Mock data for DebateIL application
// This file contains fictional data that matches the database schema

export const mockUsers = [
  {
    id: 1,
    username: "debatemaster",
    email: "david.cohen@email.com",
    firstName: "David",
    lastName: "Cohen",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-09-16T08:15:00Z",
  },
  {
    id: 2,
    username: "logicqueen",
    email: "sarah.levi@email.com",
    firstName: "Sarah",
    lastName: "Levi",
    createdAt: "2025-02-20T14:22:00Z",
    updatedAt: "2025-09-15T16:45:00Z",
  },
  {
    id: 3,
    username: "techguru",
    email: "michael.green@email.com",
    firstName: "Michael",
    lastName: "Green",
    createdAt: "2025-03-10T09:45:00Z",
    updatedAt: "2025-09-16T11:30:00Z",
  },
  {
    id: 4,
    username: "climateactivist",
    email: "rachel.brown@email.com",
    firstName: "Rachel",
    lastName: "Brown",
    createdAt: "2025-04-05T13:20:00Z",
    updatedAt: "2025-09-16T07:12:00Z",
  },
  {
    id: 5,
    username: "educator",
    email: "alex.smith@email.com",
    firstName: "Alex",
    lastName: "Smith",
    createdAt: "2025-05-12T16:15:00Z",
    updatedAt: "2025-09-15T19:30:00Z",
  },
  {
    id: 6,
    username: "economist_pro",
    email: "maya.rosenberg@email.com",
    firstName: "Maya",
    lastName: "Rosenberg",
    createdAt: "2025-06-01T12:30:00Z",
    updatedAt: "2025-09-16T14:20:00Z",
  },
  {
    id: 7,
    username: "startup_ninja",
    email: "omer.katz@email.com",
    firstName: "Omer",
    lastName: "Katz",
    createdAt: "2025-06-15T09:00:00Z",
    updatedAt: "2025-09-16T18:45:00Z",
  },
  {
    id: 8,
    username: "policy_expert",
    email: "noa.feldman@email.com",
    firstName: "Noa",
    lastName: "Feldman",
    createdAt: "2025-07-01T16:20:00Z",
    updatedAt: "2025-09-16T10:30:00Z",
  },
  {
    id: 9,
    username: "med_student",
    email: "yoni.shamir@email.com",
    firstName: "Yoni",
    lastName: "Shamir",
    createdAt: "2025-07-20T11:15:00Z",
    updatedAt: "2025-09-16T15:10:00Z",
  },
  {
    id: 10,
    username: "data_scientist",
    email: "tamar.goldberg@email.com",
    firstName: "Tamar",
    lastName: "Goldberg",
    createdAt: "2025-08-01T13:45:00Z",
    updatedAt: "2025-09-16T12:30:00Z",
  },
];
// Utility to get avatar URL based on last two digits of user id
export function getAvatarById(userId) {
  const lastTwoDigits = userId % 100;
  // You can switch between men/women or use only one for simplicity
  const gender = lastTwoDigits % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${lastTwoDigits}.jpg`;
}
// ...existing code...

export const mockDebates = [
  // Live Debates - דיונים פעילים כרגע
  {
    id: 1,
    topic: "Should Israel implement a 4-day work week?",
    start_time: "2025-09-17T14:00:00Z",
    end_time: "2025-09-17T16:00:00Z",
    status: "live",
    user1_id: 1,
    user2_id: 6,
    score_user1: 0,
    score_user2: 0,
    winner_id: null,
    participants_count: 2,
    messages_count: 8,
    final_score: null,
  },
  {
    id: 2,
    topic:
      "Cryptocurrency regulation in Israel - Necessary protection or innovation killer?",
    start_time: "2025-09-17T15:30:00Z",
    end_time: "2025-09-17T17:30:00Z",
    status: "live",
    user1_id: 7,
    user2_id: 10,
    score_user1: 0,
    score_user2: 0,
    winner_id: null,
    participants_count: 2,
    messages_count: 12,
    final_score: null,
  },

  // Scheduled/Available Debates - דיונים פתוחים להרשמה
  {
    id: 3,
    topic:
      "Universal Basic Income: Solution to unemployment or economic disaster?",
    start_time: "2025-09-18T19:00:00Z",
    end_time: "2025-09-18T21:00:00Z",
    status: "scheduled",
    user1_id: 6,
    user2_id: null,
    score_user1: null,
    score_user2: null,
    winner_id: null,
    participants_count: 1,
    messages_count: 0,
    final_score: null,
  },
  {
    id: 4,
    topic:
      "Should social media platforms be held responsible for misinformation?",
    start_time: "2025-09-19T20:00:00Z",
    end_time: "2025-09-19T22:00:00Z",
    status: "scheduled",
    user1_id: null,
    user2_id: null,
    score_user1: null,
    score_user2: null,
    winner_id: null,
    participants_count: 0,
    messages_count: 0,
    final_score: null,
  },
  {
    id: 5,
    topic:
      "Electric vehicles in Israel: Ready for mass adoption or premature push?",
    start_time: "2025-09-20T18:00:00Z",
    end_time: "2025-09-20T20:00:00Z",
    status: "scheduled",
    user1_id: 4,
    user2_id: null,
    score_user1: null,
    score_user2: null,
    winner_id: null,
    participants_count: 1,
    messages_count: 0,
    final_score: null,
  },
  {
    id: 6,
    topic:
      "AI in Israeli healthcare: Revolutionary breakthrough or risky gamble?",
    start_time: "2025-09-21T16:00:00Z",
    end_time: "2025-09-21T18:00:00Z",
    status: "scheduled",
    user1_id: 9,
    user2_id: null,
    score_user1: null,
    score_user2: null,
    winner_id: null,
    participants_count: 1,
    messages_count: 0,
    final_score: null,
  },

  // Finished Debates - דיונים שהסתיימו
  {
    id: 7,
    topic: "Remote work vs Office culture: The future of Israeli high-tech",
    start_time: "2025-09-15T19:00:00Z",
    end_time: "2025-09-15T21:00:00Z",
    status: "finished",
    user1_id: 3,
    user2_id: 7,
    score_user1: 89,
    score_user2: 76,
    winner_id: 3,
    participants_count: 2,
    messages_count: 15,
    final_score: "89-76",
  },
  {
    id: 8,
    topic:
      "Hebrew vs English in Israeli tech education: Cultural preservation or global competitiveness?",
    start_time: "2025-09-14T20:00:00Z",
    end_time: "2025-09-14T22:00:00Z",
    status: "finished",
    user1_id: 5,
    user2_id: 8,
    score_user1: 82,
    score_user2: 91,
    winner_id: 8,
    participants_count: 2,
    messages_count: 18,
    final_score: "82-91",
  },
  {
    id: 9,
    topic:
      "Startup Nation: Has Israeli innovation peaked or just getting started?",
    start_time: "2025-09-13T17:00:00Z",
    end_time: "2025-09-13T19:00:00Z",
    status: "finished",
    user1_id: 7,
    user2_id: 2,
    score_user1: 94,
    score_user2: 87,
    winner_id: 7,
    participants_count: 2,
    messages_count: 21,
    final_score: "94-87",
  },
  {
    id: 10,
    topic:
      "Israeli housing crisis: Government intervention or free market solution?",
    start_time: "2025-09-12T18:30:00Z",
    end_time: "2025-09-12T20:30:00Z",
    status: "finished",
    user1_id: 6,
    user2_id: 8,
    score_user1: 78,
    score_user2: 85,
    winner_id: 8,
    participants_count: 2,
    messages_count: 14,
    final_score: "78-85",
  },
  {
    id: 11,
    topic: "Public transportation in Israel: Investment priority or money pit?",
    start_time: "2025-09-11T16:00:00Z",
    end_time: "2025-09-11T18:00:00Z",
    status: "finished",
    user1_id: 4,
    user2_id: 1,
    score_user1: 88,
    score_user2: 79,
    winner_id: 4,
    participants_count: 2,
    messages_count: 16,
    final_score: "88-79",
  },
  {
    id: 12,
    topic:
      "Data privacy in Israel: European-style GDPR or American-style freedom?",
    start_time: "2025-09-10T19:30:00Z",
    end_time: "2025-09-10T21:30:00Z",
    status: "finished",
    user1_id: 10,
    user2_id: 3,
    score_user1: 85,
    score_user2: 85,
    winner_id: null,
    participants_count: 2,
    messages_count: 19,
    final_score: "85-85",
  },
];

export const mockArguments = [
  // Arguments for debate 1 (4-day work week in Israel) - Live: David vs Maya
  {
    id: 1,
    debate_id: 1,
    user_id: 1,
    text: "Israel's tech sector already shows that productivity isn't tied to hours worked. Microsoft Japan saw 40% productivity increase with a 4-day week. Israeli workers are burning out - we need this change.",
    timestamp: "2025-09-17T14:05:00Z",
  },
  {
    id: 2,
    debate_id: 1,
    user_id: 6,
    text: "Israel's economy relies on global competitiveness. While our tech sector is strong, we compete with countries working 6-7 days. Reducing work days could hurt our GDP growth and startup ecosystem.",
    timestamp: "2025-09-17T14:08:00Z",
  },
  {
    id: 3,
    debate_id: 1,
    user_id: 1,
    text: "But happier, less stressed workers are MORE productive. Look at Iceland's trial - same output with 35-36 hour weeks. Israeli workers are already among the most stressed in OECD countries.",
    timestamp: "2025-09-17T14:12:00Z",
  },
  {
    id: 4,
    debate_id: 1,
    user_id: 6,
    text: "Iceland has a different economic structure. Israel's high-tech and defense industries require constant innovation and long hours. We can't afford to fall behind China or the US who work longer.",
    timestamp: "2025-09-17T14:15:00Z",
  },

  // Arguments for debate 2 (Crypto regulation) - Live: Omer vs Tamar
  {
    id: 5,
    debate_id: 2,
    user_id: 7,
    text: "Over-regulation killed crypto innovation in China and India. Israel should be the crypto capital of the world, not follow failed regulatory models. Innovation requires freedom to experiment.",
    timestamp: "2025-09-17T15:35:00Z",
  },
  {
    id: 6,
    debate_id: 2,
    user_id: 10,
    text: "FTX collapse cost investors billions globally. Israelis lost millions in Terra Luna and other scams. Smart regulation protects innovation while preventing fraud - look at Singapore's balanced approach.",
    timestamp: "2025-09-17T15:38:00Z",
  },
  {
    id: 7,
    debate_id: 2,
    user_id: 7,
    text: "But who decides what's fraud vs innovation? Government bureaucrats who don't understand blockchain? Let the market decide - bad projects will fail naturally without stifling good ones.",
    timestamp: "2025-09-17T15:42:00Z",
  },
  {
    id: 8,
    debate_id: 2,
    user_id: 10,
    text: "The market failed with FTX, UST, and dozens of rug pulls. Retail investors need protection. Professional investors can handle risks, but grandmothers losing pensions to crypto scams is unacceptable.",
    timestamp: "2025-09-17T15:45:00Z",
  },

  // Arguments for finished debate 7 (Remote work vs Office) - Michael vs Omer
  {
    id: 9,
    debate_id: 7,
    user_id: 3,
    text: "Israeli high-tech's success came from spontaneous collisions - bumping into colleagues, overhearing conversations, impromptu brainstorming. Zoom calls can't replicate this magic.",
    timestamp: "2025-09-15T19:10:00Z",
  },
  {
    id: 10,
    debate_id: 7,
    user_id: 7,
    text: "That's nostalgia, not data. GitHub, GitLab, and Automattic built billion-dollar companies with remote teams. Israeli developers can contribute to global projects without commuting 2 hours daily.",
    timestamp: "2025-09-15T19:15:00Z",
  },
  {
    id: 11,
    debate_id: 7,
    user_id: 3,
    text: "Remote work creates isolation and burnout. Mental health suffers when work and home blend. Israeli startups need intense collaboration and quick decision-making that requires physical presence.",
    timestamp: "2025-09-15T19:20:00Z",
  },
  {
    id: 12,
    debate_id: 7,
    user_id: 7,
    text: "Office culture created the burnout epidemic! 12-hour days, commute stress, office politics. Remote work gives parents time with kids and eliminates the toxic hustle culture destroying work-life balance.",
    timestamp: "2025-09-15T19:25:00Z",
  },

  // Arguments for finished debate 8 (Hebrew vs English in tech education) - Alex vs Noa
  {
    id: 13,
    debate_id: 8,
    user_id: 5,
    text: "Hebrew tech education creates inclusive opportunities for non-English speakers and preserves our cultural identity. Not everyone needs to think in English to innovate.",
    timestamp: "2025-09-14T20:05:00Z",
  },
  {
    id: 14,
    debate_id: 8,
    user_id: 8,
    text: "Global tech communication is in English. Israeli developers who can't engage with international open source, documentation, and conferences are severely limited in their career growth.",
    timestamp: "2025-09-14T20:10:00Z",
  },
  {
    id: 15,
    debate_id: 8,
    user_id: 5,
    text: "But forcing English-only creates barriers for brilliant minds from diverse backgrounds. We're losing talent from Ethiopian, Russian, and Arab communities who could innovate in Hebrew first.",
    timestamp: "2025-09-14T20:15:00Z",
  },
  {
    id: 16,
    debate_id: 8,
    user_id: 8,
    text: "Teaching both is ideal, but resources are limited. English opens doors to Silicon Valley, European markets, and global remote work. Hebrew-only programmers compete locally; English speakers compete globally.",
    timestamp: "2025-09-14T20:20:00Z",
  },

  // Arguments for finished debate 9 (Startup Nation future) - Omer vs Sarah
  {
    id: 17,
    debate_id: 9,
    user_id: 7,
    text: "Israel has more unicorns per capita than anywhere. Our military tech experience, chutzpah culture, and global connections are just hitting their stride. AI and cybersecurity are our next frontiers.",
    timestamp: "2025-09-13T17:05:00Z",
  },
  {
    id: 18,
    debate_id: 9,
    user_id: 2,
    text: "We're victims of our own success. Talent shortage, rising costs, and brain drain to the US show our limits. China and India are outspending us 100:1 on R&D. We had our moment.",
    timestamp: "2025-09-13T17:10:00Z",
  },
  {
    id: 19,
    debate_id: 9,
    user_id: 7,
    text: "Quality beats quantity. One Israeli exit like Waze or Mobileye is worth hundreds of copy-cat startups. Our innovation DNA comes from necessity, not just money.",
    timestamp: "2025-09-13T17:15:00Z",
  },
  {
    id: 20,
    debate_id: 9,
    user_id: 2,
    text: "Necessity is ending. Young Israelis prefer stability over startup risk. Without the existential pressure that created our success, we're becoming just another developed country.",
    timestamp: "2025-09-13T17:20:00Z",
  },
];

export const mockVotes = [
  // Votes for live debate 1 (4-day work week) - ongoing voting
  { id: 1, debate_id: 1, voter_id: 3, timestamp: "2025-09-17T14:20:00Z" },
  { id: 2, debate_id: 1, voter_id: 5, timestamp: "2025-09-17T14:25:00Z" },
  { id: 3, debate_id: 1, voter_id: 8, timestamp: "2025-09-17T14:30:00Z" },
  { id: 4, debate_id: 1, voter_id: 9, timestamp: "2025-09-17T14:35:00Z" },

  // Votes for live debate 2 (crypto regulation) - ongoing voting
  { id: 5, debate_id: 2, voter_id: 1, timestamp: "2025-09-17T15:50:00Z" },
  { id: 6, debate_id: 2, voter_id: 4, timestamp: "2025-09-17T15:55:00Z" },
  { id: 7, debate_id: 2, voter_id: 6, timestamp: "2025-09-17T16:00:00Z" },

  // Votes for finished debate 7 (Remote work) - Michael won
  { id: 8, debate_id: 7, voter_id: 1, timestamp: "2025-09-15T20:45:00Z" },
  { id: 9, debate_id: 7, voter_id: 2, timestamp: "2025-09-15T20:47:00Z" },
  { id: 10, debate_id: 7, voter_id: 4, timestamp: "2025-09-15T20:50:00Z" },
  { id: 11, debate_id: 7, voter_id: 6, timestamp: "2025-09-15T20:52:00Z" },
  { id: 12, debate_id: 7, voter_id: 8, timestamp: "2025-09-15T20:55:00Z" },
  { id: 13, debate_id: 7, voter_id: 9, timestamp: "2025-09-15T21:00:00Z" },
  { id: 14, debate_id: 7, voter_id: 10, timestamp: "2025-09-15T21:02:00Z" },

  // Votes for finished debate 8 (Hebrew vs English) - Noa won
  { id: 15, debate_id: 8, voter_id: 1, timestamp: "2025-09-14T21:45:00Z" },
  { id: 16, debate_id: 8, voter_id: 3, timestamp: "2025-09-14T21:47:00Z" },
  { id: 17, debate_id: 8, voter_id: 6, timestamp: "2025-09-14T21:50:00Z" },
  { id: 18, debate_id: 8, voter_id: 7, timestamp: "2025-09-14T21:52:00Z" },
  { id: 19, debate_id: 8, voter_id: 9, timestamp: "2025-09-14T21:55:00Z" },
  { id: 20, debate_id: 8, voter_id: 10, timestamp: "2025-09-14T22:00:00Z" },

  // Votes for finished debate 9 (Startup Nation) - Omer won
  { id: 21, debate_id: 9, voter_id: 1, timestamp: "2025-09-13T18:30:00Z" },
  { id: 22, debate_id: 9, voter_id: 3, timestamp: "2025-09-13T18:32:00Z" },
  { id: 23, debate_id: 9, voter_id: 4, timestamp: "2025-09-13T18:35:00Z" },
  { id: 24, debate_id: 9, voter_id: 6, timestamp: "2025-09-13T18:37:00Z" },
  { id: 25, debate_id: 9, voter_id: 8, timestamp: "2025-09-13T18:40:00Z" },
  { id: 26, debate_id: 9, voter_id: 10, timestamp: "2025-09-13T18:42:00Z" },

  // Votes for finished debate 10 (Housing crisis) - Noa won
  { id: 27, debate_id: 10, voter_id: 1, timestamp: "2025-09-12T20:15:00Z" },
  { id: 28, debate_id: 10, voter_id: 3, timestamp: "2025-09-12T20:17:00Z" },
  { id: 29, debate_id: 10, voter_id: 5, timestamp: "2025-09-12T20:20:00Z" },
  { id: 30, debate_id: 10, voter_id: 7, timestamp: "2025-09-12T20:22:00Z" },
  { id: 31, debate_id: 10, voter_id: 9, timestamp: "2025-09-12T20:25:00Z" },

  // Votes for finished debate 11 (Public transportation) - Rachel won
  { id: 32, debate_id: 11, voter_id: 2, timestamp: "2025-09-11T17:45:00Z" },
  { id: 33, debate_id: 11, voter_id: 3, timestamp: "2025-09-11T17:47:00Z" },
  { id: 34, debate_id: 11, voter_id: 6, timestamp: "2025-09-11T17:50:00Z" },
  { id: 35, debate_id: 11, voter_id: 8, timestamp: "2025-09-11T17:52:00Z" },
  { id: 36, debate_id: 11, voter_id: 10, timestamp: "2025-09-11T17:55:00Z" },

  // Votes for finished debate 12 (Data privacy) - Draw
  { id: 37, debate_id: 12, voter_id: 1, timestamp: "2025-09-10T21:15:00Z" },
  { id: 38, debate_id: 12, voter_id: 4, timestamp: "2025-09-10T21:17:00Z" },
  { id: 39, debate_id: 12, voter_id: 6, timestamp: "2025-09-10T21:20:00Z" },
  { id: 40, debate_id: 12, voter_id: 8, timestamp: "2025-09-10T21:22:00Z" },
  { id: 41, debate_id: 12, voter_id: 9, timestamp: "2025-09-10T21:25:00Z" },
];

// Helper functions to work with the mock data
export const getDebateById = (id) => {
  return mockDebates.find((debate) => debate.id === id);
};

export const getUserById = (id) => {
  return mockUsers.find((user) => user.id === id);
};

export const getArgumentsForDebate = (debateId) => {
  return mockArguments.filter((arg) => arg.debate_id === debateId);
};

export const getVotesForDebate = (debateId) => {
  return mockVotes.filter((vote) => vote.debate_id === debateId);
};

export const getDebatesByStatus = (status) => {
  return mockDebates.filter((debate) => debate.status === status);
};

export const getArgumentsWithUserInfo = (debateId) => {
  const debateArguments = getArgumentsForDebate(debateId);
  return debateArguments.map((arg) => ({
    ...arg,
    user: getUserById(arg.user_id),
  }));
};

export const getDebateStats = () => {
  return {
    totalDebates: mockDebates.length,
    liveDebates: mockDebates.filter((d) => d.status === "live").length,
    scheduledDebates: mockDebates.filter((d) => d.status === "scheduled")
      .length,
    finishedDebates: mockDebates.filter((d) => d.status === "finished").length,
    totalUsers: mockUsers.length,
    totalArguments: mockArguments.length,
    totalVotes: mockVotes.length,
  };
};

// Get user statistics including win/loss record
export const getUserStats = (userId) => {
  const userDebates = mockDebates.filter(
    (debate) => debate.user1_id === userId || debate.user2_id === userId
  );

  const finishedDebates = userDebates.filter((d) => d.status === "finished");
  const liveDebates = userDebates.filter((d) => d.status === "live");
  const scheduledDebates = userDebates.filter((d) => d.status === "scheduled");

  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalScore = 0;

  finishedDebates.forEach((debate) => {
    const scores = getDebateScores(debate.id);
    if (scores.hasScores) {
      if (scores.isDraw) {
        draws++;
      } else if (scores.winner?.userId === userId) {
        wins++;
      } else {
        losses++;
      }

      // Add user's score to total
      if (debate.user1_id === userId) {
        totalScore += scores.user1Score;
      } else {
        totalScore += scores.user2Score;
      }
    }
  });

  return {
    totalDebates: userDebates.length,
    finishedDebates: finishedDebates.length,
    liveDebates: liveDebates.length,
    scheduledDebates: scheduledDebates.length,
    wins,
    losses,
    draws,
    winRate:
      finishedDebates.length > 0
        ? ((wins / finishedDebates.length) * 100).toFixed(1)
        : 0,
    averageScore:
      finishedDebates.length > 0
        ? (totalScore / finishedDebates.length).toFixed(1)
        : 0,
    totalScore,
  };
};

// Get participants (user1 and user2) for a debate
export const getDebateParticipants = (debateId) => {
  const debate = getDebateById(debateId);
  if (!debate) return { user1: null, user2: null };

  return {
    user1: getUserById(debate.user1_id),
    user2: getUserById(debate.user2_id),
  };
};

// Check if a user is a participant in a debate
export const isUserParticipant = (debateId, userId) => {
  const debate = getDebateById(debateId);
  return debate && (debate.user1_id === userId || debate.user2_id === userId);
};

// Get debate scores and winner info
export const getDebateScores = (debateId) => {
  const debate = getDebateById(debateId);
  if (!debate || debate.status !== "finished") {
    return {
      hasScores: false,
      user1Score: null,
      user2Score: null,
      winner: null,
      isDraw: false,
    };
  }

  const user1Score = debate.score_user1 || 0;
  const user2Score = debate.score_user2 || 0;

  let winner = null;
  let isDraw = false;

  if (user1Score > user2Score) {
    winner = { userId: debate.user1_id, score: user1Score };
  } else if (user2Score > user1Score) {
    winner = { userId: debate.user2_id, score: user2Score };
  } else {
    isDraw = true;
  }

  return {
    hasScores: true,
    user1Score,
    user2Score,
    winner,
    isDraw,
    scoreDifference: Math.abs(user1Score - user2Score),
  };
};

// Get debate registration status with availability info
export const getDebateAvailability = (debateId) => {
  const debate = getDebateById(debateId);
  if (!debate) return { availableSpots: 0, status: "not-found", isFull: true };

  const availableSpots = [debate.user1_id, debate.user2_id].filter(
    (id) => !id
  ).length;

  let status = "full";
  if (availableSpots === 2) status = "open";
  else if (availableSpots === 1) status = "one-spot";

  return {
    availableSpots,
    status,
    isFull: availableSpots === 0,
  };
};

// Backward compatibility functions
export const getDebateAvailableSpots = (debateId) =>
  getDebateAvailability(debateId).availableSpots;
export const isDebateFull = (debateId) =>
  getDebateAvailability(debateId).isFull;
export const getDebateRegistrationStatus = (debateId) =>
  getDebateAvailability(debateId).status;

// Enhanced debate data with participant info and additional details
export const getEnhancedDebates = () => {
  return mockDebates.map((debate) => {
    const participants = getDebateParticipants(debate.id);
    const availability = getDebateAvailability(debate.id);
    const scores = getDebateScores(debate.id);

    return {
      ...debate,
      user1: participants.user1,
      user2: participants.user2,
      participants_count: 2 - availability.availableSpots,
      available_spots: availability.availableSpots,
      registration_status: availability.status,
      is_full: availability.isFull,
      arguments_count: getArgumentsForDebate(debate.id).length,
      recent_activity: mockArguments
        .filter((arg) => arg.debate_id === debate.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
        ?.timestamp,
      // Score information
      scores: scores,
      winner: scores.winner,
      is_draw: scores.isDraw,
    };
  });
};
