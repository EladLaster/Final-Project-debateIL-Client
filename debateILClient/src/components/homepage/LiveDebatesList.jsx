import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import StatusBadge from "../basic-ui/StatusBadge";
import { getAvatarById } from "../../api/randomAvatar";

export default function LiveDebatesList({ debates }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextDebate = () => {
    if (window.innerWidth >= 768) {
      // Desktop: move by 3 debates
      setCurrentIndex((prev) => {
        const next = prev + 3;
        return next >= debates.length ? 0 : next;
      });
    } else {
      // Mobile: move by 1 debate
      setCurrentIndex((prev) => (prev + 1) % debates.length);
    }
  };

  const prevDebate = () => {
    if (window.innerWidth >= 768) {
      // Desktop: move by 3 debates
      setCurrentIndex((prev) => {
        const previous = prev - 3;
        return previous < 0
          ? Math.max(0, debates.length - (debates.length % 3 || 3))
          : previous;
      });
    } else {
      // Mobile: move by 1 debate
      setCurrentIndex((prev) => (prev - 1 + debates.length) % debates.length);
    }
  };

  if (debates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-red-600">🔴 Live Debates</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            No live debates at the moment. Check back later!
          </p>
        </div>
      </section>
    );
  }

  const handleJoinDebate = (debateId) => {
    navigate(`/debate/${debateId}`);
  };

  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.floor((now - start) / (1000 * 60));
    return `${diffMinutes}m`;
  };

  const DebateCard = ({ debate }) => (
    <ContentCard className="p-6 h-full">
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {debate.topic}
          </h3>
          <StatusBadge variant="live">🔴 Live</StatusBadge>
        </div>

        <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="font-medium">Discussion in progress</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm border border-red-200 bg-red-50 rounded-lg p-3">
          <div>
            <span className="font-medium text-red-700 block">👥</span>
            <div className="text-lg font-bold text-red-800">
              {debate.participants_count}/2
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

        <div className="flex items-center justify-around bg-gray-50 rounded-lg p-4 flex-grow">
          {debate.user1 && (
            <div className="text-center">
              <img
                src={getAvatarById(debate.user1.id)}
                alt={debate.user1.firstName}
                className="w-12 h-12 rounded-full border-2 border-blue-400 mx-auto mb-1"
              />
              <span className="font-medium text-blue-600 text-sm block truncate">
                {debate.user1.firstName}
              </span>
            </div>
          )}

          <div className="text-lg font-bold text-gray-400">VS</div>

          {debate.user2 && (
            <div className="text-center">
              <img
                src={getAvatarById(debate.user2.id)}
                alt={debate.user2.firstName}
                className="w-12 h-12 rounded-full border-2 border-red-400 mx-auto mb-1"
              />
              <span className="font-medium text-red-600 text-sm block truncate">
                {debate.user2.firstName}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <PrimaryButton
            variant="secondary"
            onClick={() => handleJoinDebate(debate.id)}
            className="flex-1 text-sm py-2"
          >
            🎯 Join
          </PrimaryButton>
          <PrimaryButton
            variant="ghost"
            onClick={() => handleJoinDebate(debate.id)}
            size="small"
            className="px-3"
          >
            ℹ️
          </PrimaryButton>
        </div>
      </div>
    </ContentCard>
  );

  return (
    <section className="mb-8">
      {/* Mobile: Single debate with arrows on top */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600">
            🔴 Live Debates ({currentIndex + 1}/{debates.length})
          </h2>

          {debates.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevDebate}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextDebate}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <DebateCard debate={debates[currentIndex]} />
      </div>

      {/* Desktop: Multiple debates with side arrows */}
      <div className="hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-red-600">
          🔴 Live Debates ({debates.length})
        </h2>

        <div className="flex items-center">
          {/* Left Arrow */}
          <div className="flex-shrink-0 w-12 flex justify-center">
            {debates.length > 3 && currentIndex > 0 && (
              <button
                onClick={prevDebate}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Debates Grid */}
          <div className="flex-1 mx-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {debates.slice(currentIndex, currentIndex + 3).map((debate) => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <div className="flex-shrink-0 w-12 flex justify-center">
            {debates.length > 3 && currentIndex + 3 < debates.length && (
              <button
                onClick={nextDebate}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
