import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">
          📚 BookStore
        </h1>

        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="text-gray-700 hover:text-black font-medium"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Discover, Buy & Review Books
        </h2>

        <p className="text-gray-600 max-w-xl mb-8">
          A modern book ordering platform where users can explore books,
          add them to cart, place orders, and leave reviews.
        </p>

        <div className="flex gap-4">
          <Link
            href="/auth/signup"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Get Started
          </Link>

          <Link
            href="/auth/login"
            className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <FeatureCard
            title="📖 Browse Books"
            description="Explore a wide range of books added by sellers."
          />
          <FeatureCard
            title="🛒 Order Easily"
            description="Add books to your cart and place orders seamlessly."
          />
          <FeatureCard
            title="⭐ Reviews & Ratings"
            description="Share your thoughts and read reviews from others."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} BookStore. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-6 text-center hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
