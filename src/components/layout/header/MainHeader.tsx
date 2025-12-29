"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Search,
  Heart,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export default function MainHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const totalCartQty = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalWishlist = wishlistItems.length;

  /* ================= CLIENT MOUNT (HYDRATION FIX) ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [mounted]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    setOpenMenu(false);
  };

  /* ================= RENDER ================= */
  return (
    <header className="bg-[#4B2E2B] text-[#F5F1E9] px-6 py-6 flex items-center justify-between relative">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-[#D35400] text-white w-8 h-8 flex items-center justify-center font-bold rounded">
          B
        </div>
        <span className="font-bold text-xl">Book Store</span>
      </Link>

      {/* SEARCH */}
      <div className="flex-1 mx-6 hidden md:block">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by book name or author"
            className="w-full px-4 py-2 rounded-l-md outline-none text-black bg-white border border-black"
          />
          <button className="bg-black px-4 rounded-r-md text-white">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex gap-5 items-center relative">
        {/* USER */}
        {mounted && (
          !user ? (
            <User
              className="cursor-pointer"
              onClick={() => setShowAuth(true)}
            />
          ) : (
            <div ref={menuRef} className="relative">
              <User
                className="cursor-pointer"
                onClick={() =>
                  setOpenMenu((prev) => !prev)
                }
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <div className="px-4 py-3 border-b text-sm">
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  {user.role !== "buyer" && (
                    <Link
                      href={`/${user.role}/books`}
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
          )
        )}

        {/* CART (MOUNTED GUARDED) */}
        <Link href="/cart" className="relative">
          <ShoppingBag className="cursor-pointer" />
          {mounted && totalCartQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalCartQty}
            </span>
          )}
        </Link>

        {/* WISHLIST (MOUNTED GUARDED) */}
        <Link href="/wishlist" className="relative">
          <Heart className="cursor-pointer" />
          {mounted && totalWishlist > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalWishlist}
            </span>
          )}
        </Link>
      </div>

      {/* AUTH MODAL */}
      {showAuth && (
        <AuthOverlay onClose={() => setShowAuth(false)} />
      )}
    </header>
  );
}
