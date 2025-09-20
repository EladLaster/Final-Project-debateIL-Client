import { useState } from "react";
import DebateCard from "./DebateCard";

export default function DebateGrid({
  debates,
  title,
  emptyMessage,
  titleColor,
  renderMiddleContent,
  renderButton,
  getWinner, // Optional function to return winner information
}) {
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
        <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      {/* Mobile: Single debate with arrows on top */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${titleColor}`}>
            {title} ({currentIndex + 1}/{debates.length})
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

        <DebateCard
          debate={debates[currentIndex]}
          renderMiddleContent={renderMiddleContent}
          renderButton={renderButton}
          getWinner={getWinner}
        />
      </div>

      {/* Desktop: Grid with side navigation */}
      <div className="hidden md:block">
        <h2 className={`text-xl font-bold mb-6 ${titleColor}`}>
          {title} ({debates.length})
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
                <DebateCard
                  key={debate.id}
                  debate={debate}
                  renderMiddleContent={renderMiddleContent}
                  renderButton={renderButton}
                  getWinner={getWinner}
                />
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
