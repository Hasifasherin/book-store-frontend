"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Slider from "@/components/slider/Slider";
import BookGrid from "@/components/book/BookGrid";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  // Only buyer or seller allowed here
  const userRole: "seller" | "buyer" =
    user?.role === "seller" ? "seller" : "buyer";

  return (
    <>
      {/* FULL WIDTH SLIDER */}
      <Slider />

      {/* PAGE CONTENT */}
      <div className="container mx-auto px-4">
        <section className="mt-10">
          <BookGrid userRole={userRole} />
        </section>
      </div>
    </>
  );
}
