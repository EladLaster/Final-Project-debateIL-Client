import UserAvatar from "../basic-ui/UserAvatar";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";

export default function ProfileCard({ user, isOwnProfile = false }) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ContentCard className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <UserAvatar
              user={user}
              size="2xl"
              className="border-4 border-blue-200 shadow-lg"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
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

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user.debatesWon || 0}
              </div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {user.debatesParticipated || 0}
              </div>
              <div className="text-sm text-gray-600">Debates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {user.argumentsCount || 0}
              </div>
              <div className="text-sm text-gray-600">Arguments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {user.votesReceived || 0}
              </div>
              <div className="text-sm text-gray-600">Votes</div>
            </div>
          </div>

          {/* Join Date */}
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Member since:</span>{" "}
            {formatJoinDate(user.createdAt)}
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex flex-col sm:flex-row gap-2">
              <PrimaryButton variant="primary" size="medium">
                ✏️ Edit Profile
              </PrimaryButton>
              <PrimaryButton variant="outline" size="medium">
                ⚙️ Settings
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
