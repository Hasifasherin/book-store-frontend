// services/sliderService.ts
import axios from "axios";
import { SliderItem } from "@/types/slider"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/sliders";

// GET all sliders
export const getSliders = async (): Promise<SliderItem[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// CREATE a new slider (FormData)
export const createSlider = async (formData: FormData): Promise<SliderItem> => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// UPDATE an existing slider by ID
export const updateSlider = async (id: string, formData: FormData): Promise<SliderItem> => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// DELETE a slider by ID
export const deleteSlider = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
