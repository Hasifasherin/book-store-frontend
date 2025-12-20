"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex items-center justify-center">
      <LoginForm onCancel={() => router.push("/")} />
    </div>
  );
}
