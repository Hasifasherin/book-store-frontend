import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// GET reviews of a book
export const getBookReviewsAPI = async (bookId: string) => {
  const res = await axios.get(`${API}/books/${bookId}/reviews`);
  return res.data;
};

// ADD review (buyer only)
export const addBookReviewAPI = async (
  bookId: string,
  review: { rating: number; comment: string },
  token: string
) => {
  const res = await axios.post(
    `${API}/books/${bookId}/reviews`,
    review,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
