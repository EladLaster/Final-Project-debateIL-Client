import DebateListCard from "./DebateListCard";

export default function LiveDebatesList({ debates }) {
  const liveDebates = debates.filter((d) => d.status === "live");
  if (liveDebates.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-red-600">Live Debates</h2>
      <div className="space-y-4">
        {liveDebates.map((debate) => (
          <DebateListCard key={debate.id} debate={debate} />
        ))}
      </div>
    </section>
  );
}
