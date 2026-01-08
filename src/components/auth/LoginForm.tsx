"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { setCart } from "@/redux/slices/cartSlice";
import { setWishlist } from "@/redux/slices/wishlistSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  onCancel: () => void; // callback to close the login modal
}

export default function LoginForm({ onCancel }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      // ✅ Login successful
      toast.success("Login successful");

      const userId = result.user._id;

      // Restore cart from localStorage
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        dispatch(setCart(JSON.parse(savedCart)));
      }

      // Restore wishlist from localStorage
      const savedWishlist = localStorage.getItem(`wishlist_${userId}`);
      if (savedWishlist) {
        dispatch(setWishlist(JSON.parse(savedWishlist)));
      }

      // Close the login form modal
      onCancel();

      // Role-based redirect
      const role = result.user.role;
      if (role === "admin") {
        router.push("/admin/dashboard"); // Admin
      } else if (role === "seller" || role === "buyer") {
        router.push("/"); // Buyer or seller homepage
      }
    } catch (error: any) {
      toast.error(error || "Invalid email or password");
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full border border-[#4B2E2B] p-2 rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-[#4B2E2B] p-2 rounded text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#BF5A2E] text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-[#4B2E2B] text-[#4B2E2B] py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
