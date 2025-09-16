import { useParams } from "react-router-dom";
export default function DebatePage() {
  const { id } = useParams();
  return (
    <section>
      <h1 className="text-2xl mb-4">Live Debate #{id}</h1>
      <p className="text-sm text-gray-600">
        The live debate interface will be built incrementally.
      </p>
    </section>
  );
}
