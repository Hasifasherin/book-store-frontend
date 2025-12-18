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

export default function SignupForm() {
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

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-md mx-auto mt-10 space-y-3"
    >
      <input
        className="w-full border p-2"
        placeholder="First Name"
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Last Name"
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Phone"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Gender (m/f)"
        onChange={(e) =>
          setForm({ ...form, gender: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        type="date"
        onChange={(e) =>
          setForm({ ...form, dob: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Confirm Password"
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
      />

      <button
        type="submit"
        className="bg-black text-white w-full py-2"
      >
        Sign Up
      </button>
    </form>
  );
}
