import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface Review {
  _id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewState {
  items: Review[];
  loading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: ReviewState = {
  items: [],
  loading: false,
};

/* ================= THUNKS ================= */

// FETCH REVIEWS
export const fetchReviews = createAsyncThunk<Review[], string>(
  "reviews/fetchReviews",
  async (bookId) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}/reviews`
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }
);

// ADD REVIEW
export const addReview = createAsyncThunk<
  Review,
  {
    bookId: string;
    review: Omit<Review, "_id" | "createdAt">; // include bookId and userId
    token: string;
  }
>("reviews/addReview", async ({ bookId, review, token }) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}/reviews`,
    review,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
});

/* ================= SLICE ================= */

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // newest first
      });
  },
});

export default reviewSlice.reducer;
