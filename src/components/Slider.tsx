"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface SliderItem {
  _id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface Props {
  userRole: "admin" | "user";
}

export default function Slider({ userRole }: Props) {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get("/api/sliders").then((res) => setSliders(res.data));
  }, []);

  const addSlider = async () => {
    if (!file) return alert("Select an image");
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/api/sliders", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setSliders((prev) => [...prev, res.data]);
  };

  return (
    <div className="slider-section">
      <div className="slider-wrapper">
        {sliders.map((s) => (
          <div key={s._id} className="slider-item">
            <img src={s.imageUrl} alt={s.title} className="w-full h-64 object-cover" />
            {userRole === "admin" && (
              <div className="flex gap-2 mt-2">
                {/* update/delete buttons */}
                <button>Update</button>
                <button>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {userRole === "admin" && (
        <div className="mt-4">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button onClick={addSlider}>Add Slider</button>
        </div>
      )}
    </div>
  );
}
