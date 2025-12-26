"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

interface WishlistState {
  items: Book[];
}

const loadWishlist = (): Book[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
};

const saveWishlist = (items: Book[]) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Book>) {
      const exists = state.items.find((b) => b._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b._id !== action.payload);
      saveWishlist(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      saveWishlist([]);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
