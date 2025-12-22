"use client";

export default function Footer() {
  return (
    <footer className="bg-[#4B2E2B] text-[#F5F1E9] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h3 className="font-semibold mb-3">About</h3>
          <p className="text-sm">
            Crossword is India’s leading bookstore offering books, stationery,
            toys, and gifts.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>All Books</li>
            <li>Best Sellers</li>
            <li>Gift Cards</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li>Contact Us</li>
            <li>Returns</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <p className="text-sm">Facebook • Instagram • Twitter</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-[#F5F1E9]/30">
        © 2025 Crossword. All rights reserved.
      </div>
    </footer>
  );
}
