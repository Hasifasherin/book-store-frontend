"use client";

import { useState } from "react";
import {
  createSlider,
  updateSlider,
  deleteSlider,
  SliderItem,
} from "@/services/sliderService";

interface Props {
  activeSlide: SliderItem | null;
  refresh: () => void;
}

export default function AdminUploadSlider({ activeSlide, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (type: "add" | "update") => {
    if (!file) return alert("Select an image");

    setLoading(true);
    const fd = new FormData();
    fd.append("image", file);

    try {
      if (type === "add") {
        await createSlider(fd);
      } else if (type === "update" && activeSlide) {
        await updateSlider(activeSlide._id, fd);
      }
      refresh();
      setFile(null);
      setOpen(false);
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeSlide) return;
    if (!confirm("Delete this banner?")) return;

    setLoading(true);
    try {
      await deleteSlider(activeSlide._id);
      refresh();
      setOpen(false);
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-30">
      {/* Hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black"
      >
        ⋮
      </button>

      {open && (
        <div className="mt-2 w-44 bg-white rounded shadow-lg p-2 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && setFile(e.target.files[0])
            }
            className="text-sm"
          />

          <button
            onClick={() => handleSubmit("add")}
            disabled={loading}
            className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
          >
            Add Banner
          </button>

          <button
            onClick={() => handleSubmit("update")}
            disabled={loading || !activeSlide}
            className="w-full bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
          >
            Replace Banner
          </button>

          <button
            onClick={handleDelete}
            disabled={loading || !activeSlide}
            className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
          >
            Delete Banner
          </button>
        </div>
      )}
    </div>
  );
}
