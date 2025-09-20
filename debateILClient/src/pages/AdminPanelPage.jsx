import { useState, useEffect } from "react";
import { getDebates } from "../stores/usersStore";
import { usersStore } from "../stores/usersStore";
import { authStore } from "../stores/authStore";
import { getAllUsers } from "../services/serverApi";
import { getAdminLevel, hasAdminPermission } from "../utils/adminAuth";
import ContentCard from "../components/ui/ContentCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import UserAvatar from "../components/ui/UserAvatar";

export default function AdminPanelPage() {
  const [debates, setDebates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDebate, setSelectedDebate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDebateModal, setShowDebateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDebates: 0,
    liveDebates: 0,
    finishedDebates: 0,
    scheduledDebates: 0,
  });

  const currentUser = authStore.activeUser;
  const adminLevel = getAdminLevel(currentUser);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load debates
      const debatesData = await getDebates();
      setDebates(debatesData || []);

      // Calculate stats
      const totalDebates = debatesData?.length || 0;
      const liveDebates =
        debatesData?.filter((d) => d.status === "live").length || 0;
      const finishedDebates =
        debatesData?.filter((d) => d.status === "finished").length || 0;
      const scheduledDebates =
        debatesData?.filter((d) => d.status === "scheduled").length || 0;

      // Get unique user IDs from debates
      const userIds = new Set();
      debatesData?.forEach((debate) => {
        if (debate.user1_id) userIds.add(debate.user1_id);
        if (debate.user2_id) userIds.add(debate.user2_id);
      });

      // Load all users from server
      const allUsers = await getAllUsers();
      setUsers(allUsers || []);

      setStats({
        totalUsers: allUsers?.length || 0,
        totalDebates,
        liveDebates,
        finishedDebates,
        scheduledDebates,
      });
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      live: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      finished: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleDebateAction = (debate, action) => {
    setSelectedDebate(debate);
    setShowDebateModal(true);
    // Here you would implement the actual action (edit, delete, etc.)
    console.log(`Admin action: ${action} on debate ${debate.id}`);
  };

  const handleUserAction = (user, action) => {
    setSelectedUser(user);
    setShowUserModal(true);
    // Here you would implement the actual action (edit, delete, etc.)
    console.log(`Admin action: ${action} on user ${user.id}`);
  };

  const canManageDebates = hasAdminPermission(currentUser, "edit_debates");
  const canManageUsers = hasAdminPermission(currentUser, "edit_users");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <PrimaryButton onClick={loadAdminData} className="mt-4">
            Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {currentUser?.firstName || "Admin"} ({adminLevel} admin)
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalDebates}
            </div>
            <div className="text-sm text-gray-600">Total Debates</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.liveDebates}
            </div>
            <div className="text-sm text-gray-600">Live Debates</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.scheduledDebates}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {stats.finishedDebates}
            </div>
            <div className="text-sm text-gray-600">Finished</div>
          </div>
        </ContentCard>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "debates", label: "Debates" },
              { id: "users", label: "Users" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ContentCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {debates.slice(0, 5).map((debate) => (
                <div
                  key={debate.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{debate.topic}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(debate.start_time)} •{" "}
                      {getStatusBadge(debate.status)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {debate.participants_count || 0} participants
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      )}

      {activeTab === "debates" && (
        <ContentCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Debates</h2>
            <div className="flex space-x-3">
              {canManageDebates && (
                <PrimaryButton onClick={() => setShowDebateModal(true)}>
                  Create Debate
                </PrimaryButton>
              )}
              <PrimaryButton onClick={loadAdminData}>Refresh</PrimaryButton>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  {canManageDebates && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {debates.map((debate) => (
                  <tr key={debate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {debate.topic}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(debate.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(debate.start_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debate.participants_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debate.messages_count || 0}
                    </td>
                    {canManageDebates && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDebateAction(debate, "edit")}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDebateAction(debate, "delete")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      )}

      {activeTab === "users" && (
        <ContentCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Active Users</h2>
            <div className="flex space-x-3">
              {canManageUsers && (
                <PrimaryButton onClick={() => setShowUserModal(true)}>
                  Create User
                </PrimaryButton>
              )}
              <PrimaryButton onClick={loadAdminData}>Refresh</PrimaryButton>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {canManageUsers && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar user={user} size="small" className="mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username || user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {
                        debates.filter(
                          (d) =>
                            d.user1_id === user.id || d.user2_id === user.id
                        ).length
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    {canManageUsers && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction(user, "edit")}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUserAction(user, "suspend")}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <ContentCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Debate Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Debates:</span>
                    <span className="font-semibold">{stats.totalDebates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Debates:</span>
                    <span className="font-semibold text-green-600">
                      {stats.liveDebates}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scheduled Debates:</span>
                    <span className="font-semibold text-blue-600">
                      {stats.scheduledDebates}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finished Debates:</span>
                    <span className="font-semibold text-gray-600">
                      {stats.finishedDebates}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">User Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-semibold">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-semibold text-green-600">
                      {users.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Debates per User:</span>
                    <span className="font-semibold">
                      {stats.totalUsers > 0
                        ? (stats.totalDebates / stats.totalUsers).toFixed(1)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>

          <ContentCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity Timeline
            </h2>
            <div className="space-y-4">
              {debates.slice(0, 10).map((debate, index) => (
                <div
                  key={debate.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {debate.topic}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(debate.start_time)} •{" "}
                      {getStatusBadge(debate.status)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {debate.participants_count || 0} participants
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      )}

      {/* Modals */}
      {showDebateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedDebate
                  ? `Manage Debate: ${selectedDebate.topic}`
                  : "Create New Debate"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Topic
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedDebate?.topic || ""}
                    placeholder="Enter debate topic..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue="60"
                    min="15"
                    max="180"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDebateModal(false);
                    setSelectedDebate(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save changes logic here
                    setShowDebateModal(false);
                    setSelectedDebate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedDebate ? "Save Changes" : "Create Debate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedUser
                  ? `Manage User: ${selectedUser.firstName} ${selectedUser.lastName}`
                  : "Create New User"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.firstName || ""}
                    placeholder="Enter first name..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.lastName || ""}
                    placeholder="Enter last name..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser?.email || ""}
                    placeholder="Enter email..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.username || ""}
                    placeholder="Enter username..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save changes logic here
                    setShowUserModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
