"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { signupUser } from "@/redux/slices/authSlice";

interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onCancel: () => void;
}

export default function SignupForm({ onCancel }: Props) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Partial<SignupFormState>>({});

  // ✅ Validation
  const validate = () => {
    const newErrors: Partial<SignupFormState> = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value) newErrors[key as keyof SignupFormState] = "Required";
    });

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(signupUser(form)); // 🔥 Backend call
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3 ">
      {[
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone" }
      ].map(({ key, label, type }) => (
        <div key={key}>
          <input
            type={type || "text"}
            placeholder={label}
            className="w-full border border-[#4B2E2B] p-2 rounded placeholder-[#4B2E2B] focus:ring-2 focus:ring-[#BF5A2E]"
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
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
            onClick={() => setForm({ ...form, gender: g })}
            className={`flex-1 py-2 rounded border ${form.gender === g
                ? "bg-[#BF5A2E] text-white border-[#BF5A2E]"
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

      <div>
        <input
          type="date"
          className="w-full border border-[#4B2E2B] p-2 rounded 
             text-[#4B2E2B] focus:text-[#4B2E2B]"
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#4B2E2B] p-2 rounded placeholder-[#4B2E2B]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && (
          <p className="text-xs text-red-600">Required</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border border-[#4B2E2B] p-2 rounded placeholder-[#4B2E2B]"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#BF5A2E] text-white py-2 rounded font-semibold hover:bg-[#a3471f]"
        >
          Submit
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
