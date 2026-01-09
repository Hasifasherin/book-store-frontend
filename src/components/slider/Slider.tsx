"use client";

import { useEffect, useState } from "react";
import { getSliders, deleteSlider } from "@/services/sliderService";
import { SliderItem } from "@/types/slider";
import { useAppSelector } from "@/redux/hooks";

interface SliderProps {
  autoPlayInterval?: number;
}

export default function Slider({ autoPlayInterval = 4000 }: SliderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    getSliders().then(setSliders);
  }, []);

  /* ---------- AUTO PLAY ---------- */
  useEffect(() => {
    if (isAdmin || sliders.length <= 1) return;

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

  if (!sliders.length) {
    return (
      <div className="w-full h-[420px] bg-gray-200 flex items-center justify-center">
        No banners
      </div>
    );
  }

  return (
    <section
      className="relative w-full h-[420px] md:h-[520px] overflow-hidden bg-black -mt-px"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliders.map((slide) => (
          <div key={slide._id} className="min-w-full h-full relative">
            <img
              src={slide.imageUrl}
              alt={slide.title || "banner"}
              className="w-full h-full object-contain md:object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10" />
          </div>
        ))}
      </div>

      {/* ARROWS */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black w-11 h-11 rounded-full shadow-md"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black w-11 h-11 rounded-full shadow-md"
          >
            ❯
          </button>
        </>
      )}

      {/* DOTS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">
        {sliders.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${i === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/60"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
