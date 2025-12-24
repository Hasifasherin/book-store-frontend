"use client";

import { useState, useRef } from "react";
import { createSlider, updateSlider, SliderItem } from "@/services/sliderService";

interface Props {
  activeSlide: SliderItem | null;
  refresh: () => void;
  onDelete: (id: string) => void;
}

export default function AdminUploadSlider({ activeSlide, refresh, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const actionTypeRef = useRef<"add" | "update">("add");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const fd = new FormData();
    fd.append("image", file);

    setLoading(true);
    try {
      if (actionTypeRef.current === "add") {
        await createSlider(fd);
      } else if (actionTypeRef.current === "update" && activeSlide) {
        await updateSlider(activeSlide._id, fd);
      }
      refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="absolute top-4 right-4 z-30">
      {/* Hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black/80 flex items-center justify-center"
      >
        ☰
      </button>

      {open && (
        <div className="mt-2 w-44 bg-white rounded shadow-lg p-2 space-y-2">
          <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleFileChange} />

          <button
            className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-left"
            onClick={() => {
              actionTypeRef.current = "add";
              fileRef.current?.click();
            }}
            disabled={loading}
          >
            Add Banner
          </button>

          <button
            className="w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-left"
            onClick={() => {
              if (!activeSlide) return alert("No active banner to edit");
              actionTypeRef.current = "update";
              fileRef.current?.click();
            }}
            disabled={loading || !activeSlide}
          >
            Replace Banner
          </button>

          <button
            className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-left"
            onClick={() => activeSlide && onDelete(activeSlide._id)}
            disabled={loading || !activeSlide}
          >
            Delete Banner
          </button>
        </div>
      )}
    </div>
  );
}
