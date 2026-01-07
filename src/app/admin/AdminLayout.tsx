"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  // Ensure client-only rendering (hydration safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin-only access
  useEffect(() => {
    if (mounted && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Announcement Bar", href: "/admin/announcement" },
    { label: "Navbar Management", href: "/admin/navbar" },
    { label: "Slider / Banner", href: "/admin/sliders" },
    { label: "Books Management", href: "/admin/books" },
    { label: "Seller Display", href: "/admin/sellers" },
    { label: "User Display", href: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#4B2E2B] text-[#F5F1E9] flex flex-col z-50">
        <div className="p-6 text-center font-bold text-xl border-b border-[#F5F1E9]/20">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded transition hover:bg-[#D35400]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#F5F1E9]/20">
          <div className="flex items-center justify-between">
            <span className="font-medium">{user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
