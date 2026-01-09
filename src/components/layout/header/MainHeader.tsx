"use client";

import { useState, useRef, useEffect } from "react";
import { User, ShoppingBag, Search, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";
import { store } from "@/redux/store";
import toast from "react-hot-toast";

export default function MainHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const handleLogout = () => {
    if (user) {
      localStorage.setItem(
        `cart_${user._id}`,
        JSON.stringify(store.getState().cart.items)
      );
      localStorage.setItem(
        `wishlist_${user._id}`,
        JSON.stringify(store.getState().wishlist.items)
      );
    }

    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(logout());

    toast.success("Logged out successfully");
    setOpenMenu(false);
  };

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  return (
    <header className="bg-white text-[#1F2937] px-6 py-7 flex items-center justify-between relative border-b border-[#E5E7EB]">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-[#1E2A5E] text-white w-8 h-8 flex items-center justify-center font-bold rounded">
          B
        </div>
        <span className="font-bold text-xl text-[#1E2A5E]">
          Book Store
        </span>
      </Link>

      {/* SEARCH */}
      <div className="flex-1 mx-6 hidden md:block">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by book name or author"
            className="w-full px-4 py-2 rounded-l-md outline-none bg-white border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E2A5E]"
          />
          <button className="bg-[#1E2A5E] px-4 rounded-r-md text-white hover:bg-[#16204A] transition">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex gap-5 items-center relative">
        {!mounted ? null : (
          <>
            {!user ? (
              <User
                className="cursor-pointer text-[#1E2A5E]"
                onClick={() => setShowAuth(true)}
              />
            ) : (
              <div ref={menuRef} className="relative">
                <User
                  className="cursor-pointer text-[#1E2A5E]"
                  onClick={() => setOpenMenu((prev) => !prev)}
                />

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50 border">
                    <div className="px-4 py-3 border-b text-sm">
                      <p className="font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    {user.role === "seller" && (
                      <Link
                        href="/seller/books"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Manage Books
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {user?.role === "buyer" && (
              <>
                <Link href="/cart" className="relative text-[#1E2A5E]">
                  <ShoppingBag />
                  {totalCartQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalCartQty}
                    </span>
                  )}
                </Link>

                <Link href="/wishlist" className="relative text-[#1E2A5E]">
                  <Heart />
                  {totalWishlist > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalWishlist}
                    </span>
                  )}
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
    </header>
  );
}
