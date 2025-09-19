export default function EmptyState({ title, message, titleColor }) {
  return (
    <section className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">{message}</p>
      </div>
    </section>
  );
}
