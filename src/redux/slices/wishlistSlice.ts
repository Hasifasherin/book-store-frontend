"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

/* ================= TYPES ================= */

interface WishlistState {
  items: Book[];
}

/* ================= INITIAL STATE ================= */
// Load from localStorage if available
const initialState: WishlistState = {
  items:
    typeof window !== "undefined" && localStorage.getItem("wishlist")
      ? JSON.parse(localStorage.getItem("wishlist")!)
      : [],
};

/* ================= HELPER ================= */
const saveWishlistToLocalStorage = (items: Book[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }
};

/* ================= SLICE ================= */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /* ---------- SET (ON LOGIN) ---------- */
    setWishlist(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
      saveWishlistToLocalStorage(state.items);
    },

    /* ---------- ADD ---------- */
    addToWishlist(state, action: PayloadAction<Book>) {
      const exists = state.items.find((b) => b._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToLocalStorage(state.items);
      }
    },

    /* ---------- REMOVE ---------- */
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b._id !== action.payload);
      saveWishlistToLocalStorage(state.items);
    },

    /* ---------- CLEAR (ON LOGOUT) ---------- */
    clearWishlist(state) {
      state.items = [];
      saveWishlistToLocalStorage(state.items);
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
