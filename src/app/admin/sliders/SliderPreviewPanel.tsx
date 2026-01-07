"use client";

import { SliderItem } from "@/types/slider";

interface Props {
  slide: SliderItem;
}

export default function SliderPreviewPanel({ slide }: Props) {
  return (
    <div className="mt-6 p-4 rounded shadow bg-white">
      <h2 className="text-lg font-semibold mb-2">Preview</h2>
      <img src={slide.imageUrl} alt={slide.title || "Slider"} className="w-full h-60 object-cover rounded" />
      {slide.title && <p className="mt-2 font-medium">{slide.title}</p>}
    </div>
  );
}
