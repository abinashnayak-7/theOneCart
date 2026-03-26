import type{ PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type{ CartItem, Product } from "../types";

const LOCAL_KEY = "kart_cart";

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  } catch {}
};

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
}

const initialState: CartState = {
  items: loadCart(),
  couponCode: "",
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) {
      const { product, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      saveCart(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
      } else {
        const idx = state.items.findIndex((i) => i.product.id === productId);
        if (idx >= 0) state.items[idx].quantity = quantity;
      }
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = "";
      state.discount = 0;
      saveCart([]);
    },
    applyCoupon(
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
    },
    clearCoupon(state) {
      state.couponCode = "";
      state.discount = 0;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  clearCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;