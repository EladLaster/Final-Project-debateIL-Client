import ContentCard from "../basic-ui/ContentCard";
import UserAvatar from "../basic-ui/UserAvatar";

export default function DebateCard({
  debate,
  renderMiddleContent,
  renderButton,
  getWinner,
}) {
  const winner = getWinner ? getWinner(debate) : null;

  return (
    <ContentCard className="p-6 h-full">
      <div className="flex flex-col space-y-3 h-full">
        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {debate.topic}
          </h3>
        </div>

        {/* Middle Content - customizable */}
        {renderMiddleContent && renderMiddleContent(debate)}

        {/* Participants */}
        <div className="flex items-center justify-around bg-gray-50 rounded-lg p-4 flex-grow">
          {debate.user1 ? (
            <div className="text-center">
              <div className="relative">
                <UserAvatar
                  user={debate.user1}
                  size="large"
                  className={`mx-auto mb-1 ${
                    winner?.id === debate.user1.id
                      ? "border-yellow-400"
                      : "border-blue-400"
                  }`}
                />
                {winner?.id === debate.user1.id && (
                  <span className="absolute -top-1 -right-1 text-yellow-500 text-lg">
                    👑
                  </span>
                )}
              </div>
              <span className="font-medium text-blue-600 text-sm block truncate">
                {debate.user1.firstName}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 mx-auto mb-1 flex items-center justify-center">
                <span className="text-gray-400 text-xs">You?</span>
              </div>
              <span className="font-medium text-gray-400 text-sm">Open</span>
            </div>
          )}

          <div className="text-lg font-bold text-gray-400">VS</div>

          {debate.user2 ? (
            <div className="text-center">
              <div className="relative">
                <UserAvatar
                  user={debate.user2}
                  size="large"
                  className={`mx-auto mb-1 ${
                    winner?.id === debate.user2.id
                      ? "border-yellow-400"
                      : "border-red-400"
                  }`}
                />
                {winner?.id === debate.user2.id && (
                  <span className="absolute -top-1 -right-1 text-yellow-500 text-lg">
                    👑
                  </span>
                )}
              </div>
              <span className="font-medium text-red-600 text-sm block truncate">
                {debate.user2.firstName}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 mx-auto mb-1 flex items-center justify-center">
                <span className="text-gray-400 text-xs">You?</span>
              </div>
              <span className="font-medium text-gray-400 text-sm">Open</span>
            </div>
          )}
        </div>

        {/* Button */}
        {renderButton && <div className="mt-auto">{renderButton(debate)}</div>}
      </div>
    </ContentCard>
  );
}
