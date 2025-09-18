import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import UserStats from "../components/profile/UserStats";
import UserDebateHistory from "../components/profile/UserDebateHistory";
import EditProfile from "../components/profile/EditProfile";
import { authStore } from "../stores/authStore";
import { getDebates } from "../services/serverApi";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userDebates, setUserDebates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = authStore.activeUser?.id?.toString() === id;

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // For now, use the current user or create a mock user
      if (isOwnProfile && authStore.activeUser) {
        setUser(authStore.activeUser);
      } else {
        // Mock user data for other profiles
        setUser({
          id: parseInt(id),
          firstName: "John",
          lastName: "Doe",
          email: `user${id}@example.com`,
          username: `user${id}`,
          createdAt: "2024-01-15T10:30:00Z",
          debatesWon: Math.floor(Math.random() * 20),
          debatesParticipated: Math.floor(Math.random() * 50),
          argumentsCount: Math.floor(Math.random() * 100),
          votesReceived: Math.floor(Math.random() * 200),
          winRate: `${Math.floor(Math.random() * 100)}%`,
          averageScore: Math.floor(Math.random() * 100),
          currentStreak: Math.floor(Math.random() * 10),
          ranking: `#${Math.floor(Math.random() * 1000)}`,
        });
      }

      // Load user's debates
      const allDebates = await getDebates();
      const userDebatesList = allDebates.filter(
        (debate) =>
          debate.user1?.id?.toString() === id ||
          debate.user2?.id?.toString() === id
      );
      setUserDebates(userDebatesList);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      // Update user data
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);

      // Update authStore if it's the current user
      if (isOwnProfile) {
        authStore.activeUser = updatedUser;
        localStorage.activeUser = JSON.stringify(updatedUser);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back
        </button>
      </div>

      {/* Profile Content */}
      {isEditing ? (
        <EditProfile
          user={user}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          <ProfileCard user={user} isOwnProfile={isOwnProfile} />
          <UserStats user={user} />
          <UserDebateHistory userId={id} debates={userDebates} />
        </div>
      )}
    </div>
  );
}
