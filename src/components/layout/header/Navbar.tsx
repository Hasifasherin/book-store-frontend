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
    <nav className="bg-[#F5F1E9] text-[#2E1C1C] py-3 px-6 flex gap-6 font-medium uppercase text-sm overflow-x-auto">
      {menuItems.map((item) => (
        <Link
          key={item}
          href="/"
          className="hover:underline whitespace-nowrap"
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}
