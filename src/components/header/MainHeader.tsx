"use client";

import { useState } from "react";
import { User, ShoppingBag, Search, Heart } from "lucide-react";
import Link from "next/link";
import AuthOverlay from "@/components/auth/AuthOverlay";

export default function MainHeader() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="bg-[#4B2E2B] text-[#F5F1E9] px-6 py-15 flex items-center justify-between">
      
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
            placeholder="Search For ISBN, Book Name, Author"
            className="w-full px-4 py-2 rounded-l-md outline-none placeholder-gray-200 focus:ring-2 focus:ring-[#D35400] focus:border-[#D35400] border border-[#F5F1E9]"
          />
          <button className="bg-black px-4 rounded-r-md flex items-center justify-center">
            <Search className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Icons */}
      <div className="flex gap-5">
        <User
          className="cursor-pointer text-[#F5F1E9]"
          onClick={() => setShowAuth(true)}
        />
        <ShoppingBag className="cursor-pointer text-[#F5F1E9]" />
        <Heart className="cursor-pointer text-[#F5F1E9]" />
      </div>

      {/* Auth Overlay */}
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
    </div>
  );
}
