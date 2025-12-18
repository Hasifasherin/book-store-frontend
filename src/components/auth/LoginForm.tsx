"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";


export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={submitHandler} className="max-w-md mx-auto mt-10 space-y-3">
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-black text-white w-full py-2">Login</button>
    </form>
  );
}
