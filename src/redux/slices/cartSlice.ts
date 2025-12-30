import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

/* ================= TYPES ================= */

export interface CartItem {
  bookId: string;
  title: string;
  price: number;
  coverImage: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

/* ================= INITIAL STATE ================= */
const initialState: CartState = {
  items: [],
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ---------- SET CART (ON LOGIN) ---------- */
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },

    /* ---------- ADD ---------- */
    addToCart(state, action: PayloadAction<Book>) {
      const existing = state.items.find(
        (i) => i.bookId === action.payload._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          bookId: action.payload._id,
          title: action.payload.title,
          price: action.payload.discount
            ? Math.round(
                action.payload.price -
                  (action.payload.price * action.payload.discount) / 100
              )
            : action.payload.price,
          coverImage: action.payload.coverImage,
          quantity: 1,
        });
      }
    },

    /* ---------- REMOVE ---------- */
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload
      );
    },

    /* ---------- UPDATE QTY ---------- */
    updateQuantity(
      state,
      action: PayloadAction<{ bookId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.bookId === action.payload.bookId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    /* ---------- CLEAR (ON LOGOUT) ---------- */
    clearCart(state) {
      state.items = [];
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
