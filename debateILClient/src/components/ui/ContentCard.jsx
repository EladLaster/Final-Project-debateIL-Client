// Content Card component as a container
export default function ContentCard({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
