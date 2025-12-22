import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Book } from "@/types/book";

// Axios instance
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

/* ===================== THUNKS ===================== */

// Fetch all books
export const fetchBooks = createAsyncThunk<Book[]>(
  "books/fetch",
  async () => {
    const res = await API.get("/api/books");
    return res.data as Book[];
  }
);

// Add book (admin / seller)
export const addBook = createAsyncThunk<Book, FormData>(
  "books/add",
  async (formData) => {
    const res = await API.post("/api/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as Book;
  }
);

// Update book
export const updateBook = createAsyncThunk<
  Book,
  { id: string; formData: FormData }
>("books/update", async ({ id, formData }) => {
  const res = await API.put(`/api/books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as Book;
});

// Delete book
export const deleteBook = createAsyncThunk<string, string>(
  "books/delete",
  async (id) => {
    await API.delete(`/api/books/${id}`);
    return id;
  }
);

/* ===================== SLICE ===================== */

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- FETCH -------- */
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch books";
      })

      /* -------- ADD -------- */
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.books.unshift(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to add book";
      })

      /* -------- UPDATE -------- */
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.books = state.books.map((book) =>
          book._id === action.payload._id ? action.payload : book
        );
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to update book";
      })

      /* -------- DELETE -------- */
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.books = state.books.filter(
          (book) => book._id !== action.payload
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to delete book";
      });
  },
});

export default bookSlice.reducer;
