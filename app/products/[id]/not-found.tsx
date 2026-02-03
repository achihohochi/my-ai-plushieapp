import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Plushie Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the plushie you're looking for.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse All Plushies
        </Link>
      </div>
    </div>
  );
}
