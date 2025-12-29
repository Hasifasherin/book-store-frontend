import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Book } from "@/types/book";

/* ===================== AXIOS ===================== */

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===================== STATE ===================== */

interface BookState {
  books: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
};

/* ===================== THUNKS ===================== */

// Fetch all books
export const fetchBooks = createAsyncThunk<Book[]>(
  "books/fetch",
  async () => {
    const res = await API.get("/api/books");
    return res.data;
  }
);

//  Fetch book by ID (Book Details Page)
export const fetchBookById = createAsyncThunk<Book, string>(
  "books/fetchById",
  async (id) => {
    const res = await API.get(`/api/books/${id}`);
    return res.data;
  }
);

// Add book
export const addBook = createAsyncThunk<Book, FormData>(
  "books/add",
  async (formData) => {
    const res = await API.post("/api/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
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
  return res.data;
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
  reducers: {
    clearSelectedBook(state) {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* -------- FETCH ALL -------- */
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch books";
      })

      /* -------- FETCH BY ID -------- */
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch book details";
      })

      /* -------- ADD -------- */
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
      })

      /* -------- UPDATE -------- */
      .addCase(updateBook.fulfilled, (state, action) => {
        state.books = state.books.map((book) =>
          book._id === action.payload._id ? action.payload : book
        );
      })

      /* -------- DELETE -------- */
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (book) => book._id !== action.payload
        );
      });
  },
});

export const { clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
