import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import DebateGrid from "./DebateGrid";
import { authStore } from "../../../stores/authStore";
import { registerForDebate } from "../../../stores/usersStore";

// Configuration for different debate types
const DEBATE_CONFIGS = {
  live: {
    title: "🔴 Live Debates",
    titleColor: "text-red-600",
    emptyMessage: "No live debates at the moment. Check back later!",
    buttonText: "🎯 Join Live!",
    buttonVariant: "secondary",
    getMiddleContent: (debate) => {
      const calculateDuration = (startTime) => {
        const start = new Date(startTime);
        const now = new Date();
        const diffMinutes = Math.floor((now - start) / (1000 * 60));
        return `${diffMinutes}m`;
      };

      return (
        <>
          <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Discussion in progress</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm border border-red-200 bg-red-50 rounded-lg p-3">
            <div>
              <span className="font-medium text-red-700 block">👥</span>
              <div className="text-lg font-bold text-red-800">
                {(() => {
                  let count = 0;
                  if (debate.user1_id) count++;
                  if (debate.user2_id) count++;
                  return `${count}/2`;
                })()}
              </div>
            </div>
            <div>
              <span className="font-medium text-red-700 block">💬</span>
              <div className="text-lg font-bold text-red-800">
                {debate.messages_count || 4}
              </div>
            </div>
            <div>
              <span className="font-medium text-red-700 block">⏱️</span>
              <div className="text-lg font-bold text-red-800">
                {calculateDuration(debate.start_time)}
              </div>
            </div>
          </div>
        </>
      );
    },
    getButton: (debate, navigate, authStore) => (
      <PrimaryButton
        variant="secondary"
        onClick={() => navigate(`/debate/${debate.id}`)}
        className="w-full text-sm py-2"
      >
        {authStore?.activeUser ? "🎯 Join Live!" : "👁️ Watch Live"}
      </PrimaryButton>
    ),
  },

  registerable: {
    title: "🆓 Available for Registration",
    titleColor: "text-blue-600",
    emptyMessage: "No debates available for registration at the moment",
    buttonText: "⚔️ Join Battle!",
    buttonVariant: "primary",
    getMiddleContent: (debate) => {
      const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      return (
        <>
          <div className="flex items-center justify-center space-x-2 text-blue-600 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Your spot awaits!</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-center">
              <span className="font-medium text-blue-700 block">📅</span>
              <div className="text-sm font-bold text-blue-800">
                {formatDateTime(debate.start_time)}
              </div>
            </div>
            <div className="text-center">
              <span className="font-medium text-blue-700 block">👥</span>
              <div className="text-lg font-bold text-blue-800">
                {(() => {
                  let count = 0;
                  if (debate.user1_id) count++;
                  if (debate.user2_id) count++;
                  return `${count}/2`;
                })()}
              </div>
            </div>
          </div>
        </>
      );
    },
    getButton: (debate, navigate, authStore, onRegisterSuccess) => (
      <PrimaryButton
        variant="primary"
        onClick={async () => {
          if (!authStore?.activeUser) {
            navigate("/login");
            return;
          }

          if (!authStore.activeUser.id) {
            alert("❌ User ID not found. Please log in again.");
            return;
          }

          try {
            await registerForDebate(debate.id, authStore.activeUser.id);
            alert("🎉 Successfully registered for the debate!");
            if (onRegisterSuccess) {
              onRegisterSuccess();
            }
          } catch (error) {
            alert(`❌ Failed to register: ${error.message}`);
          }
        }}
        className="w-full text-sm py-2"
      >
        ⚔️ Join Battle!
      </PrimaryButton>
    ),
  },

  finished: {
    title: "✅ Finished Debates",
    titleColor: "text-gray-600",
    emptyMessage: "No finished debates to show yet",
    buttonText: "🎬 Watch Replay",
    buttonVariant: "secondary",
    getMiddleContent: (debate) => {
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };

      const getWinner = (debate) => {
        if (debate.winner_id === debate.user1?.id) return debate.user1;
        if (debate.winner_id === debate.user2?.id) return debate.user2;
        return null;
      };

      const winner = getWinner(debate);

      return (
        <>
          {winner && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <span className="text-lg">👑</span>
              <span className="font-medium">Winner: {winner.firstName}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-center">
              <span className="font-medium text-gray-700 block">📅</span>
              <div className="text-sm font-bold text-gray-800">
                {formatDate(debate.end_time || debate.start_time)}
              </div>
            </div>
            <div className="text-center">
              <span className="font-medium text-gray-700 block">⭐</span>
              <div className="text-lg font-bold text-gray-800">
                {debate.final_score || "0-0"}
              </div>
            </div>
          </div>
        </>
      );
    },
    getButton: (debate, navigate) => (
      <PrimaryButton
        variant="secondary"
        onClick={() => navigate(`/replay/${debate.id}`)}
        className="w-full text-sm py-2"
      >
        🎬 Watch Replay
      </PrimaryButton>
    ),
    getWinner: (debate) => {
      // Determine winner based on scores
      if (debate.score_user1 > debate.score_user2) {
        return {
          id: debate.user1_id,
          firstName: `User ${debate.user1_id?.slice(0, 8)}`,
        };
      }
      if (debate.score_user2 > debate.score_user1) {
        return {
          id: debate.user2_id,
          firstName: `User ${debate.user2_id?.slice(0, 8)}`,
        };
      }
      return null;
    },
  },
};

export default function DebateSection({ debates, type, onRefresh }) {
  const navigate = useNavigate();
  const config = DEBATE_CONFIGS[type];

  if (!config) {
    console.error(`Unknown debate type: ${type}`);
    return null;
  }

  const renderMiddleContent = (debate) => config.getMiddleContent(debate);
  const renderButton = (debate) =>
    config.getButton(debate, navigate, authStore, onRefresh);

  return (
    <DebateGrid
      debates={debates}
      title={config.title}
      emptyMessage={config.emptyMessage}
      titleColor={config.titleColor}
      renderMiddleContent={renderMiddleContent}
      renderButton={renderButton}
      getWinner={config.getWinner}
    />
  );
}
