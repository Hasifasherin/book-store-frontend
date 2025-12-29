import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
     cart: cartReducer,
     wishlist: wishlistReducer,
     reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
