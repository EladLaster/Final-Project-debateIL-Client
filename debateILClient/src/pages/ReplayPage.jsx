import { useParams } from "react-router-dom";
export default function ReplayPage() {
  const { id } = useParams();
  return (
    <section>
      <h1 className="text-2xl mb-4">Replay #{id}</h1>
      <p className="text-sm text-gray-600">
        A player / timeline will be integrated later.
      </p>
    </section>
  );
}
