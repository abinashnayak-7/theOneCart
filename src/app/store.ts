import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../store/productsSlice";
import cartReducer from "../store/cartSlice";
import searchReducer from "../store/searchSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;