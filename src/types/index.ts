export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  imageUrls: string[];
  isAvailable: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  name: string;
  address: string;
  city: string;
  zip: string;
  payment: "cod" | "card" | "upi";
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // btoa — demo only, not production-safe
  createdAt: string;
}

export type ColorMode = "light" | "dark";

export type Page =
  | "home"
  | "products"
  | "add"
  | "cart"
  | "checkout"
  | "confirmation"
  | "detail"
  | "login";