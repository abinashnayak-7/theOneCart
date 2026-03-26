import type{ PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type{ Product } from "../types";
import { SEED_PRODUCTS } from "../data/seedData";

const LOCAL_KEY = "kart_products";

const loadProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : SEED_PRODUCTS;
  } catch {
    return SEED_PRODUCTS;
  }
};

const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(products));
  } catch {}
};

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: loadProducts(),
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload);
      saveProducts(state.items);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveProducts(state.items);
    },
  },
});

export const { addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;