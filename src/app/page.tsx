"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Slider from "@/components/slider/Slider";
import AdminUploadSlider from "@/components/slider/AdminUploadSlider";
import BookGrid from "@/components/book/BookGrid";

export default function Homepage() {
  const user = useAppSelector((state) => state.auth.user);

  // Mounted flag to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // <-- only render after client mount

  // Determine role for UI
  const userRole: "admin" | "seller" | "buyer" =
    user?.role === "admin" ? "admin" :
    user?.role === "seller" ? "seller" :
    "buyer";

  const isAdmin = userRole === "admin";

  return (
    <div className="container mx-auto px-4">
      {/* Slider */}
      <Slider userRole={userRole} />

      {/* Book Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Featured Books</h2>
        <BookGrid userRole={userRole} />
      </section>

      {/* Admin section: manage slider */}
      {isAdmin && (
        <div className="my-10 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Admin: Manage Slider Images
          </h2>
          <AdminUploadSlider />
        </div>
      )}
    </div>
  );
}
