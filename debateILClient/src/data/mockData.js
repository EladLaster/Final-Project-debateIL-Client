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
    updatedAt: "2025-09-16T08:15:00Z"
  },
  {
    id: 2,
    username: "logicqueen",
    email: "sarah.levi@email.com",
    firstName: "Sarah",
    lastName: "Levi",
    createdAt: "2025-02-20T14:22:00Z",
    updatedAt: "2025-09-15T16:45:00Z"
  },
  {
    id: 3,
    username: "techguru",
    email: "michael.green@email.com",
    firstName: "Michael",
    lastName: "Green",
    createdAt: "2025-03-10T09:45:00Z",
    updatedAt: "2025-09-16T11:30:00Z"
  },
  {
    id: 4,
    username: "climateactivist",
    email: "rachel.brown@email.com",
    firstName: "Rachel",
    lastName: "Brown",
    createdAt: "2025-04-05T13:20:00Z",
    updatedAt: "2025-09-16T07:12:00Z"
  },
  {
    id: 5,
    username: "educator",
    email: "alex.smith@email.com",
    firstName: "Alex",
    lastName: "Smith",
    createdAt: "2025-05-12T16:15:00Z",
    updatedAt: "2025-09-15T19:30:00Z"
  }
];

export const mockDebates = [
  {
    id: 1,
    topic: "Will AI replace doctors in the future?",
    start_time: "2025-09-16T14:00:00Z",
    end_time: "2025-09-16T16:00:00Z",
    status: "live"
  },
  {
    id: 2,
    topic: "Climate policy in Israel - are we doing enough?",
    start_time: "2025-09-16T18:00:00Z",
    end_time: "2025-09-16T20:00:00Z",
    status: "scheduled"
  },
  {
    id: 3,
    topic: "Digital education vs traditional education",
    start_time: "2025-09-16T15:30:00Z",
    end_time: "2025-09-16T17:30:00Z",
    status: "live"
  },
  {
    id: 4,
    topic: "Social media impact on democracy",
    start_time: "2025-09-17T10:00:00Z",
    end_time: "2025-09-17T12:00:00Z",
    status: "scheduled"
  },
  {
    id: 5,
    topic: "Should university education be free?",
    start_time: "2025-09-15T19:00:00Z",
    end_time: "2025-09-15T21:00:00Z",
    status: "finished"
  },
  {
    id: 6,
    topic: "Remote work vs office work - what's better?",
    start_time: "2025-09-14T16:00:00Z",
    end_time: "2025-09-14T18:00:00Z",
    status: "finished"
  }
];

export const mockArguments = [
  // Arguments for debate 1 (AI replacing doctors)
  {
    id: 1,
    debate_id: 1,
    user_id: 1,
    text: "AI can process medical data much faster than humans and identify patterns that doctors might miss. Studies show AI diagnostic tools already outperform doctors in detecting certain cancers.",
    timestamp: "2025-09-16T14:05:00Z"
  },
  {
    id: 2,
    debate_id: 1,
    user_id: 2,
    text: "While AI is powerful, medicine requires human empathy and understanding. Patients need emotional support and personalized care that only humans can provide.",
    timestamp: "2025-09-16T14:07:00Z"
  },
  {
    id: 3,
    debate_id: 1,
    user_id: 3,
    text: "AI could handle routine diagnoses, freeing doctors to focus on complex cases and patient interaction. It's not replacement, it's augmentation.",
    timestamp: "2025-09-16T14:12:00Z"
  },
  {
    id: 4,
    debate_id: 1,
    user_id: 4,
    text: "What happens when AI makes a mistake? Medical liability and accountability are huge concerns when lives are at stake.",
    timestamp: "2025-09-16T14:15:00Z"
  },

  // Arguments for debate 3 (Digital vs traditional education)
  {
    id: 5,
    debate_id: 3,
    user_id: 5,
    text: "Digital education provides personalized learning experiences and can adapt to each student's pace. It's also more accessible to students with disabilities.",
    timestamp: "2025-09-16T15:35:00Z"
  },
  {
    id: 6,
    debate_id: 3,
    user_id: 1,
    text: "Traditional education builds social skills and collaborative learning that screens can't replicate. Students need face-to-face interaction for proper development.",
    timestamp: "2025-09-16T15:40:00Z"
  },
  {
    id: 7,
    debate_id: 3,
    user_id: 2,
    text: "The COVID pandemic proved that digital education can work effectively when properly implemented. Many students actually performed better online.",
    timestamp: "2025-09-16T15:45:00Z"
  },

  // Arguments for finished debate 5 (Free university education)
  {
    id: 8,
    debate_id: 5,
    user_id: 3,
    text: "Free university education reduces inequality and gives everyone equal opportunity regardless of economic background. It's an investment in society's future.",
    timestamp: "2025-09-15T19:10:00Z"
  },
  {
    id: 9,
    debate_id: 5,
    user_id: 4,
    text: "Someone has to pay for it through taxes. This could burden taxpayers and might lead to overcrowded universities with reduced quality.",
    timestamp: "2025-09-15T19:15:00Z"
  },
  {
    id: 10,
    debate_id: 5,
    user_id: 5,
    text: "Countries like Germany and Finland have proven that free higher education can work effectively while maintaining high standards.",
    timestamp: "2025-09-15T19:25:00Z"
  }
];

export const mockVotes = [
  // Votes for debate 1 (AI replacing doctors)
  { id: 1, debate_id: 1, voter_id: 1, timestamp: "2025-09-16T14:20:00Z" },
  { id: 2, debate_id: 1, voter_id: 2, timestamp: "2025-09-16T14:22:00Z" },
  { id: 3, debate_id: 1, voter_id: 3, timestamp: "2025-09-16T14:25:00Z" },
  { id: 4, debate_id: 1, voter_id: 4, timestamp: "2025-09-16T14:27:00Z" },
  { id: 5, debate_id: 1, voter_id: 5, timestamp: "2025-09-16T14:30:00Z" },

  // Votes for debate 3 (Digital education)
  { id: 6, debate_id: 3, voter_id: 1, timestamp: "2025-09-16T15:50:00Z" },
  { id: 7, debate_id: 3, voter_id: 2, timestamp: "2025-09-16T15:52:00Z" },
  { id: 8, debate_id: 3, voter_id: 4, timestamp: "2025-09-16T15:55:00Z" },

  // Votes for finished debate 5 (Free university)
  { id: 9, debate_id: 5, voter_id: 1, timestamp: "2025-09-15T20:45:00Z" },
  { id: 10, debate_id: 5, voter_id: 2, timestamp: "2025-09-15T20:47:00Z" },
  { id: 11, debate_id: 5, voter_id: 3, timestamp: "2025-09-15T20:50:00Z" },
  { id: 12, debate_id: 5, voter_id: 4, timestamp: "2025-09-15T20:52:00Z" },
  { id: 13, debate_id: 5, voter_id: 5, timestamp: "2025-09-15T20:55:00Z" },

  // Votes for finished debate 6 (Remote work)
  { id: 14, debate_id: 6, voter_id: 2, timestamp: "2025-09-14T17:45:00Z" },
  { id: 15, debate_id: 6, voter_id: 3, timestamp: "2025-09-14T17:47:00Z" },
  { id: 16, debate_id: 6, voter_id: 4, timestamp: "2025-09-14T17:50:00Z" }
];

// Helper functions to work with the mock data
export const getDebateById = (id) => {
  return mockDebates.find(debate => debate.id === id);
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getArgumentsForDebate = (debateId) => {
  return mockArguments.filter(arg => arg.debate_id === debateId);
};

export const getVotesForDebate = (debateId) => {
  return mockVotes.filter(vote => vote.debate_id === debateId);
};

export const getDebatesByStatus = (status) => {
  return mockDebates.filter(debate => debate.status === status);
};

export const getArgumentsWithUserInfo = (debateId) => {
  const debateArguments = getArgumentsForDebate(debateId);
  return debateArguments.map(arg => ({
    ...arg,
    user: getUserById(arg.user_id)
  }));
};

export const getDebateStats = () => {
  return {
    totalDebates: mockDebates.length,
    liveDebates: mockDebates.filter(d => d.status === 'live').length,
    scheduledDebates: mockDebates.filter(d => d.status === 'scheduled').length,
    finishedDebates: mockDebates.filter(d => d.status === 'finished').length,
    totalUsers: mockUsers.length,
    totalArguments: mockArguments.length,
    totalVotes: mockVotes.length
  };
};

// Enhanced debate data with participant counts and additional info
export const getEnhancedDebates = () => {
  return mockDebates.map(debate => ({
    ...debate,
    participants_count: getVotesForDebate(debate.id).length,
    arguments_count: getArgumentsForDebate(debate.id).length,
    recent_activity: mockArguments
      .filter(arg => arg.debate_id === debate.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp
  }));
};