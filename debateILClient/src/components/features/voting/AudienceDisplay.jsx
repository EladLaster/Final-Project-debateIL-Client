import UserAvatar from "../../ui/UserAvatar";

/**
 * AudienceDisplay Component
 * Shows audience members who are watching the debate
 */
const AudienceDisplay = ({ audience = [] }) => {
  if (!audience || audience.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-1 pb-2 px-4">
        <div className="text-gray-500 text-center">
          <div className="text-sm font-semibold mb-1">👥 Audience</div>
          <div className="text-xs">No audience members yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-1 pb-2 px-4">
      <div className="text-center mb-2">
        <div className="text-sm font-semibold text-gray-700 mb-1">
          👥 Audience ({audience.length})
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
        {audience.map((member) => (
          <div
            key={member.id}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white border-2 sm:border-3 md:border-4 border-gray-400 flex items-center justify-center text-sm sm:text-base md:text-lg shadow-lg"
            title={`Audience #${member.id}`}
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={`Audience #${member.id}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : member.firstName ? (
              <UserAvatar user={member} size="2xl" className="w-full h-full" />
            ) : (
              <span className="text-gray-300">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudienceDisplay;
