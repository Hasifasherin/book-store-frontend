"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center text-[#4B2E2B] mb-6">
          Login to Your Account
        </h1>
        <LoginForm onCancel={() => router.push("/")} />
      </div>
    </div>
  );
}
