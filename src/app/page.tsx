"use client";

import { useAppSelector } from "@/redux/hooks";
import Slider from "@/components/Slider";
import AdminUploadSlider from "@/components/AdminUploadSlider";

export default function Homepage() {
  const user = useAppSelector((state) => state.auth.user);

  // Map seller/buyer to "user" for Slider prop
  const userRole: "admin" | "user" =
    user?.role === "admin" ? "admin" : "user";

  const isAdmin = user?.role === "admin";

  return (
    <div>
      {/* Slider visible to all users */}
      <Slider userRole={userRole} />

      {/* Admin section */}
      {isAdmin && (
        <div className="my-8 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Admin: Manage Slider Images
          </h2>
          <AdminUploadSlider />
        </div>
      )}
    </div>
  );
}
