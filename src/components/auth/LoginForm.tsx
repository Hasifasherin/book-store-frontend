"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";

interface Props {
  onCancel: () => void;
}

export default function LoginForm({ onCancel }: Props) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.email) newErrors.email = "Required";
    if (!form.password) newErrors.password = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginUser(form)); // 🔥 backend auth
  };

  const inputClass =
    "w-full border border-[#4B2E2B] p-2 rounded placeholder-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#BF5A2E]";

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className={inputClass}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-[#BF5A2E] text-white py-2 rounded font-semibold hover:bg-[#a3471f]"
        >
          Login
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
