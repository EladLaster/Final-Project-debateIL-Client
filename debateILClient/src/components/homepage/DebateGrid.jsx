import { useState } from "react";
import DebateCard from "./DebateCard";
import NavigationButtons from "./NavigationButtons";
import EmptyState from "./EmptyState";

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
      <EmptyState
        title={title}
        message={emptyMessage}
        titleColor={titleColor}
      />
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
            <NavigationButtons
              onPrev={prevDebate}
              onNext={nextDebate}
              showPrev={true}
              showNext={true}
              size="small"
            />
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
              <NavigationButtons
                onPrev={prevDebate}
                onNext={null}
                showPrev={true}
                showNext={false}
                size="large"
              />
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
              <NavigationButtons
                onPrev={null}
                onNext={nextDebate}
                showPrev={false}
                showNext={true}
                size="large"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
