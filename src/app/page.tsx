"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Slider from "@/components/slider/Slider";
import BookGrid from "@/components/book/BookGrid";

export default function Homepage() {
  const user = useAppSelector((state) => state.auth.user);

  const userRole =
    user?.role === "admin"
      ? "admin"
      : user?.role === "seller"
      ? "seller"
      : "buyer";

  return (
    <>
      {/* FULL WIDTH SLIDER (no container) */}
      <Slider />

      {/* NORMAL PAGE CONTENT */}
      <div className="container mx-auto px-4">
        <section className="mt-10">
          
          <BookGrid userRole={userRole} />
        </section>
      </div>
    </>
  );
}
