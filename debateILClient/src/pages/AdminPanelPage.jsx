import { useState, useEffect } from "react";
import {
  getDebates,
  finishDebateForUser,
  usersStore,
} from "../stores/usersStore";
import { authManager } from "../stores/authManager";
import { getAllUsers, deleteDebate } from "../services/serverApi";
import { getAllArguments, deleteArgument } from "../services/argumentsApi";
import { getAdminLevel, hasAdminPermission } from "../utils/adminAuth";
import { formatDate, getStatusBadgeClass } from "../utils/formatters";
import ContentCard from "../components/ui/ContentCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import UserAvatar from "../components/ui/UserAvatar";

export default function AdminPanelPage() {
  const [debates, setDebates] = useState([]);
  const [users, setUsers] = useState([]);
  const [allArguments, setAllArguments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("debates");
  const [selectedDebate, setSelectedDebate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDebateModal, setShowDebateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDebates: 0,
    liveDebates: 0,
  });

  const currentUser = authManager.user;
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

      // Load all users and arguments
      const [allUsers, argumentsData] = await Promise.all([
        getAllUsers(),
        getAllArguments(),
      ]);

      setUsers(allUsers || []);
      setAllArguments(argumentsData || []);

      // Calculate stats
      setStats({
        totalUsers: allUsers?.length || 0,
        totalDebates: debatesData?.length || 0,
        liveDebates:
          debatesData?.filter((d) => d.status === "live").length || 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDebateAction = (debate, action) => {
    setSelectedDebate(debate);
    setShowDebateModal(true);
    // Here you would implement the actual action (edit, delete, etc.)
  };

  const handleUserAction = (user, action) => {
    setSelectedUser(user);
    setShowUserModal(true);
    // Here you would implement the actual action (edit, delete, etc.)
  };

  const handleDelete = async (id, type, deleteFn, setStateFn) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      await deleteFn(id);
      setStateFn((prev) => prev.filter((item) => item.id !== id));

      // If deleting a debate, also remove its arguments
      if (type === "debate") {
        setAllArguments((prev) => prev.filter((arg) => arg.debate?.id !== id));
      }

      alert(`${type} deleted successfully!`);
    } catch (error) {
      alert(`Failed to delete ${type}: ${error.message}`);
    }
  };

  const handleFinishDebate = async (debateId) => {
    if (!window.confirm("Are you sure you want to finish this debate?")) return;

    try {
      const updatedDebate = await finishDebateForUser(debateId);
      setDebates((prev) =>
        prev.map((debate) => (debate.id === debateId ? updatedDebate : debate))
      );
      alert("Debate finished successfully!");
    } catch (error) {
      alert(`Failed to finish debate: ${error.message}`);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalDebates}
            </div>
            <div className="text-sm text-gray-600">Debates</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.liveDebates}
            </div>
            <div className="text-sm text-gray-600">Live Now</div>
          </div>
        </ContentCard>
        <ContentCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {allArguments.length}
            </div>
            <div className="text-sm text-gray-600">Arguments</div>
          </div>
        </ContentCard>
      </div>

      {/* Platform Analytics */}
      <ContentCard className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span>Finished Debates:</span>
                <span className="font-semibold text-gray-600">
                  {debates.filter((d) => d.status === "finished").length}
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
                <span>Active Participants:</span>
                <span className="font-semibold text-blue-600">
                  {
                    new Set(
                      debates
                        .flatMap((d) => [d.user1_id, d.user2_id])
                        .filter(Boolean)
                    ).size
                  }
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
          <div>
            <h3 className="text-lg font-medium mb-3">Content Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Arguments:</span>
                <span className="font-semibold">{allArguments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Arguments per Debate:</span>
                <span className="font-semibold">
                  {stats.totalDebates > 0
                    ? (allArguments.length / stats.totalDebates).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most Active Debate:</span>
                <span className="font-semibold text-purple-600">
                  {(() => {
                    const debateWithMostArgs = debates.reduce((max, debate) => {
                      const currentCount = debate.arguments_count || 0;
                      const maxCount = max.arguments_count || 0;
                      return currentCount > maxCount ? debate : max;
                    }, debates[0] || {});

                    if (
                      debateWithMostArgs &&
                      debateWithMostArgs.arguments_count > 0
                    ) {
                      return `${debateWithMostArgs.topic?.slice(0, 20)}... (${
                        debateWithMostArgs.arguments_count
                      } args)`;
                    }
                    return "N/A";
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most Active User:</span>
                <span className="font-semibold text-purple-600">
                  {(() => {
                    const userCounts = {};
                    allArguments.forEach((arg) => {
                      if (arg.author?.id) {
                        userCounts[arg.author.id] =
                          (userCounts[arg.author.id] || 0) + 1;
                      }
                    });
                    const mostActive = Object.entries(userCounts).sort(
                      (a, b) => b[1] - a[1]
                    )[0];
                    ("Most Active User: John Doe (4 args)");
                    if (mostActive) {
                      const user = users.find((u) => u.id === mostActive[0]);
                      const userName = user
                        ? `${user.firstName} ${user.lastName}`
                        : `User ${mostActive[0].slice(0, 8)}`;
                      return `${userName} (${mostActive[1]} args)`;
                    }
                    return "N/A";
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "debates", label: "Debates" },
              { id: "arguments", label: "Arguments" },
              { id: "users", label: "Users" },
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
      {activeTab === "debates" && (
        <ContentCard className="p-6 mb-8">
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arguments
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
                      <span className={getStatusBadgeClass(debate.status)}>
                        {debate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(debate.start_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {
                        [debate.user1_id, debate.user2_id].filter(Boolean)
                          .length
                      }
                      /2
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">💬</span>
                        <span className="font-semibold text-blue-600">
                          {debate.arguments_count || 0}
                        </span>
                      </div>
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
                          {debate.status === "live" && (
                            <button
                              onClick={() => handleFinishDebate(debate.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Finish
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDelete(
                                debate.id,
                                "debate",
                                deleteDebate,
                                setDebates
                              )
                            }
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

      {activeTab === "arguments" && (
        <ContentCard className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Arguments</h2>
            <PrimaryButton onClick={loadAdminData}>Refresh</PrimaryButton>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allArguments.map((argument) => (
                  <tr key={argument.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar
                          user={argument.author}
                          size="small"
                          className="mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {argument.author?.firstName}{" "}
                            {argument.author?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{argument.author?.username || argument.author?.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {argument.debate?.topic}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span
                          className={getStatusBadgeClass(
                            argument.debate?.status
                          )}
                        >
                          {argument.debate?.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(argument.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleDelete(
                              argument.id,
                              "argument",
                              deleteArgument,
                              setAllArguments
                            )
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      )}

      {activeTab === "users" && (
        <ContentCard className="p-6 mb-8">
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
                    Debates
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
                      {
                        debates.filter(
                          (d) =>
                            d.user1_id === user.id || d.user2_id === user.id
                        ).length
                      }
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
