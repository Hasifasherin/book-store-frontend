"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUploadSlider() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{ _id: string; imageUrl: string }[]>([]);

  const fetchImages = () => {
    axios.get("http://localhost:4000/api/admin/slider")
      .then(res => setImages(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadHandler = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:4000/api/admin/slider", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFile(null);
      fetchImages();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/slider/${id}`);
      fetchImages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <button onClick={uploadHandler} className="px-4 py-2 bg-[#BF5A2E] text-white rounded">Upload</button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map(img => (
          <div key={img._id} className="relative">
            <img src={img.imageUrl} alt="" className="w-full h-32 object-cover rounded" />
            <button
              onClick={() => deleteHandler(img._id)}
              className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
