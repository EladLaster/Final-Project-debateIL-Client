import ContentCard from "../../ui/ContentCard";
import UserAvatar from "../../ui/UserAvatar";
import { useState, useEffect } from "react";
import { usersStore } from "../../../stores/usersStore";

export default function DebateCard({
  debate,
  renderMiddleContent,
  renderButton,
  getWinner,
}) {
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const winner = getWinner ? getWinner(debate) : null;

  // Load user details for display
  useEffect(() => {
    const loadUsers = () => {
      if (debate.user1_id) {
        const userData = usersStore.getUserForComponent(debate.user1_id);
        if (userData) {
          setUser1(userData);
        } else {
          // Fallback to mock user if not found
          setUser1({
            id: debate.user1_id,
            firstName: `User ${debate.user1_id.slice(0, 8)}`,
          });
        }
      }

      if (debate.user2_id) {
        const userData = usersStore.getUserForComponent(debate.user2_id);
        if (userData) {
          setUser2(userData);
        } else {
          // Fallback to mock user if not found
          setUser2({
            id: debate.user2_id,
            firstName: `User ${debate.user2_id.slice(0, 8)}`,
          });
        }
      }
    };

    loadUsers();
  }, [debate.user1_id, debate.user2_id]);

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
          {user1 ? (
            <div className="text-center">
              <div className="relative">
                <UserAvatar
                  user={user1}
                  size="large"
                  className={`mx-auto mb-1 ${
                    winner?.id === user1.id
                      ? "border-yellow-400"
                      : "border-blue-400"
                  }`}
                />
                {winner?.id === user1.id && (
                  <span className="absolute -top-1 -right-1 text-yellow-500 text-lg">
                    👑
                  </span>
                )}
              </div>
              <span className="font-medium text-blue-600 text-sm block truncate">
                {user1.firstName}
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

          {user2 ? (
            <div className="text-center">
              <div className="relative">
                <UserAvatar
                  user={user2}
                  size="large"
                  className={`mx-auto mb-1 ${
                    winner?.id === user2.id
                      ? "border-yellow-400"
                      : "border-red-400"
                  }`}
                />
                {winner?.id === user2.id && (
                  <span className="absolute -top-1 -right-1 text-yellow-500 text-lg">
                    👑
                  </span>
                )}
              </div>
              <span className="font-medium text-red-600 text-sm block truncate">
                {user2.firstName}
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
