"use client";

import { SliderItem } from "@/types/slider";

interface Props {
  sliders: SliderItem[];
  loading: boolean;
  onSelect: (slide: SliderItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  selectedSlide: SliderItem | null;
}

export default function SlidersGrid({ sliders, loading, onSelect, onDelete, onAdd, selectedSlide }: Props) {
  if (loading) return <p className="text-center py-6">Loading banners...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Add New Slider Card */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center h-36 cursor-pointer hover:border-gray-600 hover:bg-gray-50 transition"
        onClick={onAdd}
      >
        <span className="text-gray-600 font-semibold">+ Add Slider</span>
      </div>

      {/* Slider Cards */}
      {sliders.map((slide) => (
        <div
          key={slide._id}
          className={`relative rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer ${
            selectedSlide?._id === slide._id ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <img src={slide.imageUrl} alt={slide.title || "Banner"} className="w-full h-36 object-cover" />

          <div className="absolute inset-0 bg-black/25 opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-2 transition">
            <button
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 w-20"
              onClick={() => onSelect(slide)}
            >
              View
            </button>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-20"
              onClick={() => onDelete(slide._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
