// Date and time formatting utilities
const formatDatePart = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTimePart = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return formatDatePart(new Date(dateString));
};

export const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  return formatTimePart(new Date(dateString));
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${formatDatePart(date)} ${formatTimePart(date)}`;
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

// Status badge formatting - returns className string instead of JSX
export const getStatusBadgeClass = (status) => {
  const colors = {
    live: "bg-green-100 text-green-800",
    scheduled: "bg-blue-100 text-blue-800",
    finished: "bg-gray-100 text-gray-800",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${
    colors[status] || "bg-gray-100 text-gray-800"
  }`;
};
