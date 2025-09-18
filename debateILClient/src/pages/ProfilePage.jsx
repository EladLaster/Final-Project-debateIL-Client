import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();

  return (
    <section>
      <h1 className="text-2xl mb-4">Profile #{id}</h1>
      <p className="text-sm text-gray-600">
        Statistics and achievements will be displayed here.
      </p>
    </section>
  );
}
