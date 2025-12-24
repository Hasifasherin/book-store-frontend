import axios from "axios";

export interface SliderItem {
  _id: string;
  imageUrl: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/sliders";

export const getSliders = async (): Promise<SliderItem[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Accept FormData for file upload
export const createSlider = async (formData: FormData): Promise<SliderItem> => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateSlider = async (id: string, formData: FormData): Promise<SliderItem> => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteSlider = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
