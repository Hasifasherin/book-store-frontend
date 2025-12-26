import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

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

const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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

      saveCart(state.items);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload
      );
      saveCart(state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ bookId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.bookId === action.payload.bookId
      );
      if (item) item.quantity = action.payload.quantity;
      saveCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
