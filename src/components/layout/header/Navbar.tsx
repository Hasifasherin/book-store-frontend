import Link from "next/link";

export default function Navbar() {
  const menuItems = [
    "All Books",
    "Top 50",
    "Kids Books",
    "Novels",
    "Adventure",
    "DC Published",
    "Book Awards",
  ];

  return (
    <nav className="bg-[#FFFFFF]/90 text-[#1E293B] py-4 px-6 flex gap-6 font-medium uppercase text-xs overflow-x-auto backdrop-blur-sm">
      {menuItems.map((item) => (
        <Link
          key={item}
          href="/"
          className="hover:text-[#1E2A5E] transition whitespace-nowrap"
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}
