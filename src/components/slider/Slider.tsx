"use client";

import { useEffect, useState } from "react";

interface SliderProps {
  userRole?: "admin" | "seller" | "buyer";
}

export default function Slider({ userRole }: SliderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR text rendering
  if (!mounted) {
    return (
      <div className="w-full h-60 bg-gray-200 rounded-lg" />
    );
  }

  return (
    <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 text-lg">
        {userRole === "admin"
          ? "Admin Slider Preview"
          : "Featured Slider"}
      </p>
    </div>
  );
}
