"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { setCart } from "@/redux/slices/cartSlice";
import { setWishlist } from "@/redux/slices/wishlistSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ unwrap guarantees correct payload type
      const auth = await dispatch(loginUser({ email, password })).unwrap();
      const user = auth.user;

      /* ===== RESTORE USER CART ===== */
      const savedCart = localStorage.getItem(`cart_${user._id}`);
      dispatch(setCart(savedCart ? JSON.parse(savedCart) : []));

      /* ===== RESTORE USER WISHLIST ===== */
      const savedWishlist = localStorage.getItem(`wishlist_${user._id}`);
      dispatch(setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []));

      onClose();
    } catch {
      // Error already handled by auth slice
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="email"
              className="w-full border border-black px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              className="w-full border border-black px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
