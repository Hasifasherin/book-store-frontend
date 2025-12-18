import Link from "next/link";

export default function Navbar() {
  const menuItems = [
    "ALL BOOKS",
    "TOP 50",
    "KIDS BOOKS",
    "Novels",
    "Adventure",
    "DC Published",
    "BOOK STORE BOOK AWARDS",
    
  ];

  return (
    <nav className="bg-[#F5F1E9] text-[#2E1C1C] py-2 px-6 flex space-x-6 font-medium uppercase text-sm">
      {menuItems.map((item) => (
        <Link key={item} href="/" className="hover:underline">
          {item}
        </Link>
      ))}
    </nav>
  );
}
