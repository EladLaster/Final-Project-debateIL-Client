// Date and time formatting utilities
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Duration calculation
export const calculateDuration = (startTime) => {
  const start = new Date(startTime);
  const now = new Date();
  const diffMinutes = Math.floor((now - start) / (1000 * 60));
  return `${diffMinutes}m`;
};

// Text formatting
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Score formatting
export const formatScore = (score) => {
  if (score === null || score === undefined) return "N/A";
  return score.toString();
};

// User name formatting
export const formatUserName = (user) => {
  if (!user) return "Unknown User";
  return `${user.firstName} ${user.lastName}`;
};
