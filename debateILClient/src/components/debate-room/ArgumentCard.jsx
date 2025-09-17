import StatusBadge from "../basic-ui/StatusBadge.jsx";

export default function ArgumentCard({ argument, onReply, onVote }) {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* User info and timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {argument.user.firstName[0]}
            {argument.user.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {argument.user.firstName} {argument.user.lastName}
            </p>
            <p className="text-sm text-gray-500">@{argument.user.username}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {formatTime(argument.timestamp)}
          </p>
          <StatusBadge variant="live">Participant</StatusBadge>
        </div>
      </div>

      {/* Argument text */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{argument.text}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 text-sm">
        <button
          onClick={() => onVote?.(argument.id)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
        >
          <span>👍</span>
          <span>Support</span>
        </button>
        <button
          onClick={() => onReply?.(argument.id)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>💬</span>
          <span>Reply</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
          <span>📤</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
