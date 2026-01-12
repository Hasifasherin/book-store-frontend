import axios from "axios";
import { SliderItem } from "@/types/slider";
import { BASE_URL } from "@/utils/baseUrl";

const SLIDER_API = `${BASE_URL}/api/sliders`;

/* ---------------- GET ALL SLIDERS ---------------- */
export const getSliders = async (): Promise<SliderItem[]> => {
  const res = await axios.get(SLIDER_API);
  return res.data;
};

/* ---------------- CREATE SLIDER ---------------- */
export const createSlider = async (
  formData: FormData
): Promise<SliderItem> => {
  const token = localStorage.getItem("token");

  const res = await axios.post(SLIDER_API, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ---------------- UPDATE SLIDER ---------------- */
export const updateSlider = async (
  id: string,
  formData: FormData
): Promise<SliderItem> => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${SLIDER_API}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ---------------- DELETE SLIDER ---------------- */
export const deleteSlider = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");

  await axios.delete(`${SLIDER_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
