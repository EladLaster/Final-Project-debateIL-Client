import UserAvatar from "../../ui/UserAvatar";
import ContentCard from "../../ui/ContentCard";
import PrimaryButton from "../../ui/PrimaryButton";

export default function ProfileCard({
  user,
  isOwnProfile = false,
  onEditProfile,
}) {
  if (!user) {
    return (
      <ContentCard className="p-6">
        <div className="text-center text-gray-500">
          <p>User not found</p>
        </div>
      </ContentCard>
    );
  }

  const formatJoinDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ContentCard className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <UserAvatar
            user={user}
            size="2xl"
            className="border-4 border-blue-200 shadow-lg"
          />
        </div>

        {/* User Info Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">
              @{user.username || user.email?.split("@")[0]}
            </p>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>

          {/* Join Date */}
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Member since:</span>{" "}
            {formatJoinDate(user.createdAt)}
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex flex-col sm:flex-row gap-2">
              <PrimaryButton
                variant="primary"
                size="medium"
                onClick={onEditProfile}
              >
                ✏️ Edit Profile
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
