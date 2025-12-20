"use client";

import { useState, useRef, useEffect } from "react";
import { User, ShoppingBag, Search, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export default function MainHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully ");
    setOpenMenu(false);
  };

  return (
    <header className="bg-[#4B2E2B] text-[#F5F1E9] px-6 py-10 flex items-center justify-between relative">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-[#D35400] text-white w-8 h-8 flex items-center justify-center font-bold rounded">
          B
        </div>
        <span className="font-bold text-xl">Book-Store</span>
      </Link>

      {/* Search */}
      <div className="flex-1 mx-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Search  Book Name, Author"
            className="w-full px-4 py-2 rounded-l-md outline-none text-black  bg-white border border-black"
          />
          <button className="bg-black px-4 rounded-r-md">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Icons */}
      <div className="flex gap-5 items-center relative">
        
        {/* User Icon / Dropdown */}
        {!user ? (
          <User
            className="cursor-pointer"
            onClick={() => setShowAuth(true)}
          />
        ) : (
          <div ref={menuRef} className="relative">
            <User
              className="cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            />

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-md z-50">
                <div className="px-4 py-2 border-b font-semibold">
                  Hi, {user.firstName}
                </div>

                {/* Future role-based links can go here */}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <ShoppingBag className="cursor-pointer" />
        <Heart className="cursor-pointer" />
      </div>

      {/* Auth Overlay */}
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
    </header>
  );
}
