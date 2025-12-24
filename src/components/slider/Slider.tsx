"use client";

import { useEffect, useState, useRef } from "react";
import {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  SliderItem,
} from "@/services/sliderService";
import { useAppSelector } from "@/redux/hooks";

export default function Slider({ autoPlayInterval = 5000 }) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

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

    const timer = setInterval(() => {
      if (!hovering) {
        setCurrentIndex((i) => (i + 1) % sliders.length);
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [sliders, hovering, autoPlayInterval, isAdmin]);

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? sliders.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i + 1) % sliders.length);

  /* ---------- ADMIN ACTIONS ---------- */
  const handleFile = async (file: File, type: "add" | "edit") => {
    const fd = new FormData();
    fd.append("image", file);

    if (type === "add") {
      await createSlider(fd);
    } else {
      await updateSlider(sliders[currentIndex]._id, fd);
    }

    await fetchSliders();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this banner?")) return;
    await deleteSlider(sliders[currentIndex]._id);
    setMenuOpen(false);
    await fetchSliders();
  };

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

      {/* ADMIN HAMBURGER */}
      {isAdmin && (
        <div className="absolute top-4 right-6 z-30">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black/80"
          >
            ☰
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded shadow-lg w-32 text-sm overflow-hidden">
              <button
                className="w-full px-3 py-2 hover:bg-gray-100 text-left"
                onClick={() => fileRef.current?.click()}
              >
                ➕ Add
              </button>
              <button
                className="w-full px-3 py-2 hover:bg-gray-100 text-left"
                onClick={() => fileRef.current?.click()}
              >
                ✏️ Edit
              </button>
              <button
                className="w-full px-3 py-2 hover:bg-red-50 text-red-600 text-left"
                onClick={handleDelete}
              >
                🗑 Delete
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (!e.target.files?.[0]) return;
              handleFile(e.target.files[0], "edit");
              e.target.value = "";
              setMenuOpen(false);
            }}
          />
        </div>
      )}
    </section>
  );
}
