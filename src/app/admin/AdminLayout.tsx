"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  /* ================= HYDRATION SAFE ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= ADMIN GUARD ================= */
  useEffect(() => {
    if (mounted && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted) return null;

  /* ================= COMPLETE LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());  
    router.replace("/");  
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Announcement Bar" },        
    { label: "Navbar Management" },     
    { label: "Slider / Banner", href: "/admin/sliders" },
    { label: "Books Management", href: "/admin/books" },
    { label: "Seller Display", href: "/admin/sellers" },
    { label: "User Display", href: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1E293B] text-[#F8FAFC] flex flex-col z-50">
        <div className="p-6 text-center font-bold text-xl border-b border-[#F8FAFC]/20">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 rounded transition hover:bg-[#3B82F6]"
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="block px-4 py-2 rounded cursor-pointer hover:bg-[#3B82F6] transition"
                title="No redirect"
              >
                {item.label}
              </div>
            )
          )}
        </nav>

        {/* ================= SIDEBAR FOOTER ================= */}
        <div className="p-4 border-t border-[#F8FAFC]/20">
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 min-h-screen p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
