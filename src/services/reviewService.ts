import axios from "axios";
import { BASE_URL } from "@/utils/baseUrl";

/* ---------------- GET REVIEWS ---------------- */
export const getBookReviewsAPI = async (bookId: string) => {
  const res = await axios.get(`${BASE_URL}/books/${bookId}/reviews`);
  return res.data;
};

/* ---------------- ADD REVIEW ---------------- */
export const addBookReviewAPI = async (
  bookId: string,
  review: { rating: number; comment: string },
  token: string
) => {
  const res = await axios.post(
    `${BASE_URL}/books/${bookId}/reviews`,
    review,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
