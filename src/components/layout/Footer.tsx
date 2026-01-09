"use client";

export default function Footer() {
  return (
    <footer className="bg-[#1E2A5E] text-[#E5E7EB] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h3 className="font-semibold mb-3 text-white">About</h3>
          <p className="text-sm text-[#CBD5E1]">
            BookOrder is India’s leading bookstore offering books, stationery,
            toys, and gifts.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#CBD5E1]">
            <li className="hover:text-[#F97316] cursor-pointer">All Books</li>
            <li className="hover:text-[#F97316] cursor-pointer">Best Sellers</li>
            <li className="hover:text-[#F97316] cursor-pointer">Gift Cards</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Help</h3>
          <ul className="space-y-2 text-sm text-[#CBD5E1]">
            <li className="hover:text-[#F97316] cursor-pointer">Contact Us</li>
            <li className="hover:text-[#F97316] cursor-pointer">Returns</li>
            <li className="hover:text-[#F97316] cursor-pointer">FAQs</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Follow Us</h3>
          <p className="text-sm text-[#CBD5E1]">
            Facebook • Instagram • Twitter
          </p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-white/10 text-[#CBD5E1]">
        © 2025 BookOrder. All rights reserved.
      </div>
    </footer>
  );
}
