import { useState } from "react";
import { getAvatarById } from "../../api/randomAvatar";
import PrimaryButton from "../basic-ui/PrimaryButton";

export default function UserAvatar({
  user,
  size = "large",
  showEditButton = false,
  onAvatarChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.id || 1);

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-24 h-24",
    xlarge: "w-32 h-32",
  };

  const borderClasses = {
    small: "border-2",
    medium: "border-2",
    large: "border-4",
    xlarge: "border-4",
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleSave = () => {
    if (onAvatarChange) {
      onAvatarChange(selectedAvatar);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedAvatar(user?.id || 1);
    setIsEditing(false);
  };

  // Generate avatar options (1-20)
  const avatarOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Your Avatar
          </h3>

          {/* Current Selection */}
          <div className="mb-4">
            <img
              src={getAvatarById(selectedAvatar)}
              alt="Selected Avatar"
              className={`${sizeClasses[size]} ${borderClasses[size]} border-blue-500 rounded-full mx-auto shadow-lg`}
            />
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {avatarOptions.map((avatarId) => (
              <button
                key={avatarId}
                onClick={() => handleAvatarSelect(avatarId)}
                className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedAvatar === avatarId
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={getAvatarById(avatarId)}
                  alt={`Avatar ${avatarId}`}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center mt-4">
            <PrimaryButton variant="primary" size="small" onClick={handleSave}>
              ✓ Save
            </PrimaryButton>
            <PrimaryButton
              variant="outline"
              size="small"
              onClick={handleCancel}
            >
              ❌ Cancel
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <img
        src={getAvatarById(user?.id || 1)}
        alt={`${user?.firstName || user?.name || "User"}'s avatar`}
        className={`${sizeClasses[size]} ${borderClasses[size]} border-blue-200 rounded-full shadow-lg`}
      />

      {showEditButton && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
          title="Change Avatar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
