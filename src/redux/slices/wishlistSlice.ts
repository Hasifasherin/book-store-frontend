"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

/* ================= TYPES ================= */

interface WishlistState {
  items: Book[];
}

/* ================= INITIAL STATE ================= */
// ❗ IMPORTANT: no localStorage access here
const initialState: WishlistState = {
  items: [],
};

/* ================= SLICE ================= */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /* ---------- SET (ON LOGIN) ---------- */
    setWishlist(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
    },

    /* ---------- ADD ---------- */
    addToWishlist(state, action: PayloadAction<Book>) {
      const exists = state.items.find((b) => b._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },

    /* ---------- REMOVE ---------- */
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b._id !== action.payload);
    },

    /* ---------- CLEAR (ON LOGOUT) ---------- */
    clearWishlist(state) {
      state.items = [];
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
