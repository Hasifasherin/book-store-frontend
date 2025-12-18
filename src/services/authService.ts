import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const signupUserAPI = async (data: any) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

export const loginUserAPI = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
