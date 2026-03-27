import type{ PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type{ CartItem, Product } from "../types";

// ── Per-user storage helpers ──────────────────────────────────────────────────

const cartKey = (userId: string) => `kart_cart_${userId}`;

export const loadCartForUser = (userId: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartForUser = (userId: string, items: CartItem[]): void => {
  try {
    localStorage.setItem(cartKey(userId), JSON.stringify(items));
  } catch {}
};

// ── State ─────────────────────────────────────────────────────────────────────

interface CartState {
  userId: string | null;
  items: CartItem[];
  couponCode: string;
  discount: number;
}

const initialState: CartState = {
  userId: null,
  items: [],
  couponCode: "",
  discount: 0,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Called after login — loads this user's saved cart
    loadUserCart(state, action: PayloadAction<string>) {
      const userId = action.payload;
      state.userId = userId;
      state.items = loadCartForUser(userId);
      state.couponCode = "";
      state.discount = 0;
    },

    // Called on logout — wipe in-memory cart
    unloadUserCart(state) {
      state.userId = null;
      state.items = [];
      state.couponCode = "";
      state.discount = 0;
    },

    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) {
      if (!state.userId) return;
      const { product, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      saveCartForUser(state.userId, state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      if (!state.userId) return;
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
      } else {
        const idx = state.items.findIndex((i) => i.product.id === productId);
        if (idx >= 0) state.items[idx].quantity = quantity;
      }
      saveCartForUser(state.userId, state.items);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      if (!state.userId) return;
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCartForUser(state.userId, state.items);
    },

    clearCart(state) {
      if (!state.userId) return;
      state.items = [];
      state.couponCode = "";
      state.discount = 0;
      saveCartForUser(state.userId, []);
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
  loadUserCart,
  unloadUserCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  clearCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;