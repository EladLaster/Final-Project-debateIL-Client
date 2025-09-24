import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import DebateGrid from "./DebateGrid";
import { authManager } from "../../../stores/authManager";
import { registerForDebate, usersStore } from "../../../stores/usersStore";
import { formatDate, formatDateTime } from "../../../utils/formatters";

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
                {debate.arguments_count || 0}
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
    getButton: (debate, navigate, authManager) => (
      <PrimaryButton
        variant="secondary"
        onClick={() => navigate(`/debate/${debate.id}`)}
        className="w-full text-sm py-2"
      >
        {authManager?.user ? "🎯 Join Live!" : "👁️ Watch Live"}
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
    getButton: (debate, navigate, authManager, onRegisterSuccess) => (
      <PrimaryButton
        variant="primary"
        onClick={async () => {
          if (!authManager?.user) {
            navigate("/login");
            return;
          }

          if (!authManager.user.id) {
            alert("❌ User ID not found. Please log in again.");
            return;
          }

          try {
            await registerForDebate(debate.id, authManager.user.id);
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
      const getWinner = (debate) => {
        // Determine winner based on actual scores
        if (debate.score_user1 > debate.score_user2) {
          const userData = usersStore.getUserForComponent(debate.user1_id);
          return {
            id: debate.user1_id,
            firstName:
              userData?.firstName || `User ${debate.user1_id?.slice(0, 8)}`,
            score: debate.score_user1,
          };
        }
        if (debate.score_user2 > debate.score_user1) {
          const userData = usersStore.getUserForComponent(debate.user2_id);
          return {
            id: debate.user2_id,
            firstName:
              userData?.firstName || `User ${debate.user2_id?.slice(0, 8)}`,
            score: debate.score_user2,
          };
        }
        return null;
      };

      const winner = getWinner(debate);
      const finalScore = `${debate.score_user1 || 0}-${
        debate.score_user2 || 0
      }`;

      return (
        <>
          {winner && (
            <div className="flex items-center justify-center space-x-3 text-yellow-600 text-lg bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-3">
              <span className="text-2xl">👑</span>
              <div className="text-center">
                <div className="font-bold text-xl">
                  Winner: {winner.firstName}
                </div>
                <div className="text-sm text-yellow-700">
                  Score: {winner.score}
                </div>
              </div>
              <span className="text-2xl">🏆</span>
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
                {finalScore}
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
      // Determine winner based on actual scores
      if (debate.score_user1 > debate.score_user2) {
        const userData = usersStore.getUserForComponent(debate.user1_id);
        return {
          id: debate.user1_id,
          firstName:
            userData?.firstName || `User ${debate.user1_id?.slice(0, 8)}`,
        };
      }
      if (debate.score_user2 > debate.score_user1) {
        const userData = usersStore.getUserForComponent(debate.user2_id);
        return {
          id: debate.user2_id,
          firstName:
            userData?.firstName || `User ${debate.user2_id?.slice(0, 8)}`,
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
    return null;
  }

  const renderMiddleContent = (debate) => config.getMiddleContent(debate);
  const renderButton = (debate) =>
    config.getButton(debate, navigate, authManager, onRefresh);

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
