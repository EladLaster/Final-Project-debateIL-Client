import ContentCard from "../basic-ui/ContentCard";
import UserAvatar from "../basic-ui/UserAvatar";
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { authStore, usersStore } from "../../stores";

const DebateCard = observer(
  ({ debate, renderMiddleContent, renderButton, getWinner }) => {
    const winner = getWinner ? getWinner(debate) : null;

    // Get users from MobX store (reactive)
    const user1 = debate.user1_id
      ? // Check if this is the current user first
        authStore.activeUser && authStore.activeUser.id === debate.user1_id
        ? {
            id: authStore.activeUser.id,
            firstName:
              authStore.activeUser.firstName ||
              authStore.activeUser.name ||
              "You",
            lastName: authStore.activeUser.lastName || "",
            email: authStore.activeUser.email,
          }
        : usersStore.getUserForComponent(debate.user1_id)
      : null;

    const user2 = debate.user2_id
      ? // Check if this is the current user first
        authStore.activeUser && authStore.activeUser.id === debate.user2_id
        ? {
            id: authStore.activeUser.id,
            firstName:
              authStore.activeUser.firstName ||
              authStore.activeUser.name ||
              "You",
            lastName: authStore.activeUser.lastName || "",
            email: authStore.activeUser.email,
          }
        : usersStore.getUserForComponent(debate.user2_id)
      : null;

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
                  {user1.firstName} {user1.lastName}
                  {!user1.firstName && !user1.lastName && (
                    <span className="text-red-500 text-xs block">
                      DEBUG: {debate.user1_id}
                    </span>
                  )}
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
                  {user2.firstName} {user2.lastName}
                  {!user2.firstName && !user2.lastName && (
                    <span className="text-red-500 text-xs block">
                      DEBUG: {debate.user2_id}
                    </span>
                  )}
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
          {renderButton && (
            <div className="mt-auto">{renderButton(debate)}</div>
          )}
        </div>
      </ContentCard>
    );
  }
);

export default DebateCard;
