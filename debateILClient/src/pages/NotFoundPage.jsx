import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <section className="py-12">
      <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-sm text-gray-600 mb-6">
        The page you were looking for doesn't exist.
      </p>
      <Link className="text-blue-600 underline" to="/">
        Back to home
      </Link>
    </section>
  );
}
