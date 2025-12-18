"use client";

import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex items-center justify-center">
      <SignupForm onCancel={() => router.push("/")} />
    </div>
  );
}
