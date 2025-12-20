"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

interface Props {
  onCancel: () => void;
}

export default function LoginForm({ onCancel }: Props) {
  const dispatch = useAppDispatch();
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
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful 🎉");
      onCancel(); // close modal
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
