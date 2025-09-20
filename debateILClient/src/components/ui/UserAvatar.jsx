import { useState, useEffect } from "react";
import { getAvatarForUser, getInitialsAvatar } from "../../api/randomAvatar";

const getSizeClasses = (size) => {
  switch (size) {
    case "small":
      return "w-6 h-6 text-xs";
    case "medium":
      return "w-8 h-8 text-sm";
    case "large":
      return "w-12 h-12 text-base";
    case "xl":
      return "w-16 h-16 text-lg";
    case "2xl":
      return "w-24 h-24 text-xl";
    default:
      return "w-8 h-8 text-sm";
  }
};

export default function UserAvatar({
  user,
  size = "medium",
  showBorder = true,
  className = "",
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user?.avatarUrl) {
      // Use the avatar URL from the user data (from server)
      setAvatarUrl(user.avatarUrl);
    } else if (user?.id) {
      // Fallback to generating avatar if no avatarUrl
      getAvatarForUser(user.id, user.gender).then(setAvatarUrl);
    }
  }, [user?.id, user?.avatarUrl, user?.gender]);

  if (!user) {
    return (
      <div
        className={`rounded-full bg-gray-300 flex items-center justify-center ${getSizeClasses(
          size
        )} ${className}`}
      >
        <span className="text-gray-600 font-bold">?</span>
      </div>
    );
  }

  const getBorderClasses = () => {
    if (!showBorder) return "";
    return "border-2 border-blue-200";
  };

  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.name ||
    user.email?.split("@")[0] ||
    "User";

  const getSizeValue = (size) => {
    switch (size) {
      case "small":
        return 24;
      case "medium":
        return 32;
      case "large":
        return 48;
      case "xl":
        return 64;
      case "2xl":
        return 96;
      default:
        return 32;
    }
  };

  if (imageError || !avatarUrl) {
    return (
      <img
        src={getInitialsAvatar(userName, getSizeValue(size))}
        alt={`${userName}'s avatar`}
        className={`rounded-full ${getSizeClasses(
          size
        )} ${getBorderClasses()} ${className}`}
      />
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={`${userName}'s avatar`}
      className={`rounded-full ${getSizeClasses(
        size
      )} ${getBorderClasses()} ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
