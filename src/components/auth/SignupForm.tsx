"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signupUser } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "m" | "f" | "";
  role: "buyer" | "seller" | "";
  dob: string;
  password: string;
  confirmPassword: string;
}

type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;

interface Props {
  onCancel: () => void;
}

export default function SignupForm({ onCancel }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});

  /* =======================
     VALIDATION
  ======================= */
  const validate = () => {
    const newErrors: SignupFormErrors = {};

    (Object.keys(form) as (keyof SignupFormState)[]).forEach((key) => {
      if (!form[key]) newErrors[key] = "Required";
    });

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =======================
     SUBMIT
  ======================= */
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await dispatch(signupUser(form)).unwrap();
      toast.success("Signup successful 🎉");
      onCancel(); // close modal
    } catch (err: any) {
      toast.error(err || "Signup failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3">
      {/* Inputs */}
      {[
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone" },
      ].map(({ key, label, type }) => (
        <div key={key}>
          <input
            type={type || "text"}
            placeholder={label}
            value={form[key as keyof SignupFormState]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            className="w-full border border-[#4B2E2B] p-2 rounded text-black"
          />
          {errors[key as keyof SignupFormState] && (
            <p className="text-xs text-red-600">
              {errors[key as keyof SignupFormState]}
            </p>
          )}
        </div>
      ))}

      {/* Gender */}
      <div className="flex gap-3">
        {["m", "f"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() =>
              setForm({ ...form, gender: g as "m" | "f" })
            }
            className={`flex-1 py-2 rounded border ${
              form.gender === g
                ? "bg-[#BF5A2E] text-white"
                : "border-[#4B2E2B] text-[#4B2E2B]"
            }`}
          >
            {g === "m" ? "Male" : "Female"}
          </button>
        ))}
      </div>
      {errors.gender && (
        <p className="text-xs text-red-600">Required</p>
      )}

      {/* Role */}
      <div className="flex gap-3">
        {["buyer", "seller"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() =>
              setForm({ ...form, role: r as "buyer" | "seller" })
            }
            className={`flex-1 py-2 rounded border ${
              form.role === r
                ? "bg-[#BF5A2E] text-white"
                : "border-[#4B2E2B] text-[#4B2E2B]"
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>
      {errors.role && (
        <p className="text-xs text-red-600">Required</p>
      )}

      {/* DOB */}
      <input
        type="date"
        value={form.dob}
        onChange={(e) =>
          setForm({ ...form, dob: e.target.value })
        }
        className="w-full border border-[#4B2E2B] p-2 rounded text-black"
      />
      {errors.dob && (
        <p className="text-xs text-red-600">{errors.dob}</p>
      )}

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        className="w-full border border-[#4B2E2B] p-2 rounded text-black"
      />
      {errors.password && (
        <p className="text-xs text-red-600">{errors.password}</p>
      )}

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
        className="w-full border border-[#4B2E2B] p-2 rounded text-black"
      />
      {errors.confirmPassword && (
        <p className="text-xs text-red-600">
          {errors.confirmPassword}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#BF5A2E] text-white py-2 rounded"
        >
          {loading ? "Signing up..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-[#4B2E2B] py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
