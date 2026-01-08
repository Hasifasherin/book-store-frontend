"use client";

import { useEffect, useState } from "react";
import { SliderItem } from "@/types/slider";
import { getSliders, createSlider, deleteSlider } from "@/services/sliderService";

import SlidersGrid from "./SlidersGrid";
import SliderPreviewPanel from "./SliderPreviewPanel";

export default function AdminSlidersManager() {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState<SliderItem | null>(null);

  // fetch sliders from backend
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const data = await getSliders();
      setSliders(data);
      if (!activeSlide && data.length) setActiveSlide(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // ADD new slider
  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file);
    setLoading(true);
    try {
      await createSlider(fd);
      await fetchSliders();
      alert("Slider added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add slider");
    } finally {
      e.target.value = "";
      setLoading(false);
    }
  };

  // DELETE slider
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slider?")) return;
    setLoading(true);
    try {
      await deleteSlider(id);
      if (activeSlide?._id === id) setActiveSlide(null);
      await fetchSliders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Slider Cards Grid */}
      <SlidersGrid
        sliders={sliders}
        loading={loading}
        onSelect={(slide) => setActiveSlide(slide)}   
        onDelete={handleDelete}
        onAdd={() => document.getElementById("add-slider-input")?.click()} 
        selectedSlide={activeSlide}
      />

      {/* Hidden input for Add Slider */}
      <input
        type="file"
        id="add-slider-input"
        accept="image/*"
        className="hidden"
        onChange={handleAdd}
      />

      {/* Preview Panel */}
      {activeSlide && <SliderPreviewPanel slide={activeSlide} />}
    </div>
  );
}
