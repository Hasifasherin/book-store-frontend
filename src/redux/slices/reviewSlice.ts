import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  _id: string;
  bookId: string;
  userId: string | ReviewUser; // ✅ FIXED
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
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

// ================= FETCH REVIEWS =================
export const fetchReviews = createAsyncThunk<Review[], string>(
  "reviews/fetchReviews",
  async (bookId) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}/reviews`
    );

    // backend returns { items, total, averageRating }
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data)) return data;
    return [];
  }
);

// ================= ADD REVIEW =================
export const addReview = createAsyncThunk<
  Review,
  {
    bookId: string;
    review: {
      rating: number;
      comment: string;
    };
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

// ================= UPDATE REVIEW =================
export const updateReview = createAsyncThunk<
  Review,
  {
    bookId: string;
    reviewId: string;
    data: {
      rating: number;
      comment: string;
    };
    token: string;
  }
>("reviews/updateReview", async ({ reviewId, data, token }) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/reviews/${reviewId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
});

// ================= DELETE REVIEW =================
export const deleteReview = createAsyncThunk<
  string,
  {
    bookId: string;
    reviewId: string;
    token: string;
  }
>("reviews/deleteReview", async ({ reviewId, token }) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/reviews/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return reviewId;
});

/* ================= SLICE ================= */

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
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

      // ADD
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (r) => r._id !== action.payload
        );
      });
  },
});

export default reviewSlice.reducer;
