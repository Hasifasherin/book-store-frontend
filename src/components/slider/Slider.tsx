"use client";

import { useEffect, useState, useRef } from "react";
import { getSliders, deleteSlider, SliderItem } from "@/services/sliderService";
import { useAppSelector } from "@/redux/hooks";
import AdminUploadSlider from "./AdminUploadSlider";

export default function Slider({ autoPlayInterval = 3000 }) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const fetchSliders = async () => {
    const data = await getSliders();
    setSliders(data);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  /* ---------- AUTO PLAY ---------- */
  useEffect(() => {
    if (isAdmin) return;
    if (sliders.length <= 1) return;

    const interval = setInterval(() => {
      if (!hovering) {
        setCurrentIndex((i) => (i + 1) % sliders.length);
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [sliders, hovering, autoPlayInterval, isAdmin]);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? sliders.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i + 1) % sliders.length);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await deleteSlider(id);
    await fetchSliders();
    setCurrentIndex(0);
  };

  const activeSlide = sliders[currentIndex] || null;

  if (!sliders.length) {
    return (
      <div className="w-screen h-[360px] bg-gray-200 flex items-center justify-center">
        No banners
      </div>
    );
  }

  return (
    <section
      className="relative w-full h-[360px] overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* SLIDES */}
      {sliders.map((slide, i) => (
        <img
          key={slide._id}
          src={slide.imageUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          alt="banner"
        />
      ))}

      {/* USER CONTROLS */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/70"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-10 h-10 rounded-full hover:bg-black/70"
          >
            ❯
          </button>
          <div className="absolute bottom-5 w-full flex justify-center gap-2 z-20">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <AdminUploadSlider activeSlide={activeSlide} refresh={fetchSliders} onDelete={handleDelete} />
      )}
    </section>
  );
}
