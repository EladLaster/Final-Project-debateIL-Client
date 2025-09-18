export default function NavigationButtons({
  onPrev,
  onNext,
  showPrev,
  showNext,
  size = "small",
}) {
  const buttonClass =
    size === "small"
      ? "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      : "p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors";

  const iconClass = size === "small" ? "w-5 h-5" : "w-6 h-6";

  return (
    <div className="flex gap-2">
      {showPrev && (
        <button onClick={onPrev} className={buttonClass}>
          <svg
            className={iconClass}
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
      {showNext && (
        <button onClick={onNext} className={buttonClass}>
          <svg
            className={iconClass}
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
  );
}
