import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDebate, getArgumentsForDebate } from "../stores/usersStore";
import { usersStore } from "../stores/usersStore";
import UserAvatar from "../components/ui/UserAvatar";

export default function ReplayPage() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [argumentsList, setArgumentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDebateData();
  }, [id]);

  const loadDebateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const debateData = await getDebate(id);
      if (!debateData) {
        setError("Debate not found");
        return;
      }

      // Load arguments for the debate
      const argumentsData = await getArgumentsForDebate(id);
      setArgumentsList(argumentsData || []);

      // Load user data for participants
      if (debateData.user1_id || debateData.user2_id) {
        await usersStore.loadUsersForDebates([debateData]);
      }

      setDebate(debateData);
    } catch (err) {
      setError(err.message || "Failed to load debate");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading replay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Debate Not Found
          </h2>
          <p className="text-gray-600">
            The debate you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Replay: {debate.topic}
      </h2>

      {/* Debate Summary */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {debate.score_user1 || 0}
            </div>
            <div className="text-sm text-gray-600">User 1 Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {debate.score_user2 || 0}
            </div>
            <div className="text-sm text-gray-600">User 2 Score</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">📅 Start Time:</span>
              <div className="text-gray-600">
                {new Date(debate.start_time).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">🏁 End Time:</span>
              <div className="text-gray-600">
                {new Date(debate.end_time).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 shadow space-y-4">
        {argumentsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Arguments Not Available
            </h3>
            <p className="text-gray-500 mb-4">
              The server doesn't support arguments API yet. This is a demo
              debate with scores only.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This is a demonstration debate. In a real
                system, you would see all the arguments and discussion here.
              </p>
            </div>
          </div>
        ) : (
          argumentsList.map((arg, idx) => {
            // Check if this is user1 or user2 based on user_id
            const isUser1 = arg.user_id === debate.user1_id;

            return (
              <div
                key={arg.id || idx}
                className={`flex ${
                  isUser1 ? "justify-start" : "justify-end"
                } mb-4`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    isUser1 ? "order-1" : "order-2"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      isUser1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">
                      {arg.text || arg.content || "No content"}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      isUser1 ? "text-left" : "text-right"
                    }`}
                  >
                    {arg.user_id
                      ? `User ${arg.user_id.slice(0, 8)}`
                      : "Unknown User"}
                    {arg.createdAt && (
                      <span className="ml-2">
                        {new Date(arg.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${isUser1 ? "order-2 ml-2" : "order-1 mr-2"}`}>
                  <UserAvatar
                    user={{
                      id: arg.user_id,
                      firstName: "User",
                      lastName: arg.user_id?.slice(0, 8),
                    }}
                    size="medium"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
