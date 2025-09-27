// Content Card component as a container
export default function ContentCard({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
