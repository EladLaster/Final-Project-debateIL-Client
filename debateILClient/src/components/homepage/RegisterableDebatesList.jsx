import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ContentCard from "../basic-ui/ContentCard";
import PrimaryButton from "../basic-ui/PrimaryButton";
import StatusBadge from "../basic-ui/StatusBadge";
import { getAvatarById } from "../../api/randomAvatar";

export default function RegisterableDebatesList({ debates }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextDebate = () => {
    if (window.innerWidth >= 768) {
      setCurrentIndex((prev) => {
        const next = prev + 3;
        return next >= debates.length ? 0 : next;
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % debates.length);
    }
  };

  const prevDebate = () => {
    if (window.innerWidth >= 768) {
      setCurrentIndex((prev) => {
        const previous = prev - 3;
        return previous < 0
          ? Math.max(0, debates.length - (debates.length % 3 || 3))
          : previous;
      });
    } else {
      setCurrentIndex((prev) => (prev - 1 + debates.length) % debates.length);
    }
  };

  if (debates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          🆓 Available for Registration
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-600">
            No debates available for registration at the moment
          </p>
        </div>
      </section>
    );
  }

  const handleRegister = (debateId) => {
    console.log("Registering for debate:", debateId);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const DebateCard = ({ debate }) => (
    <ContentCard className="p-6 h-full">
      <div className="flex flex-col space-y-3 h-full">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {debate.topic}
          </h3>
        </div>

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
              {2 - (debate.participants_count || 0)}/2
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around bg-gray-50 rounded-lg p-4 flex-grow">
          {debate.user1 ? (
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
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 mx-auto mb-1 flex items-center justify-center">
                <span className="text-gray-400 text-xs">You?</span>
              </div>
              <span className="font-medium text-gray-400 text-sm">Open</span>
            </div>
          )}

          <div className="text-lg font-bold text-gray-400">VS</div>

          {debate.user2 ? (
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
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 mx-auto mb-1 flex items-center justify-center">
                <span className="text-gray-400 text-xs">You?</span>
              </div>
              <span className="font-medium text-gray-400 text-sm">Open</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <PrimaryButton
            variant="primary"
            onClick={() => handleRegister(debate.id)}
            className="w-full text-sm py-2"
          >
            ⚔️ Join Battle!
          </PrimaryButton>
        </div>
      </div>
    </ContentCard>
  );

  return (
    <section className="mb-8">
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-600">
            🆓 Available ({currentIndex + 1}/{debates.length})
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

      <div className="hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-blue-600">
          🆓 Available for Registration ({debates.length})
        </h2>

        <div className="flex items-center">
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

          <div className="flex-1 mx-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {debates.slice(currentIndex, currentIndex + 3).map((debate) => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </div>

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
