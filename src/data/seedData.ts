import type{ Product } from "../types";

export const BRANDS: string[] = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Puma",
  "Levis",
  "Fossil",
];

export const COUPONS: Record<string, number> = {
  FLAT10: 10,
  SAVE50: 50,
  FIRST20: 20,
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "AirMax Pro Runner",
    brand: "Nike",
    price: 4999,
    stock: 12,
    description:
      "Lightweight performance running shoe with breathable mesh upper and responsive foam cushioning for all-day comfort.",
    imageUrls: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-01",
  },
  {
    id: "p2",
    name: "Ultraboost 22",
    brand: "Adidas",
    price: 5999,
    stock: 3,
    description:
      "Premium running shoe engineered with responsive BOOST midsole for unmatched energy return and incredible comfort.",
    imageUrls: [
      "https://images.unsplash.com/photo-1546200843-d3a4e1e0103d?q=80&w=1123&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    isAvailable: true,
    createdAt: "2024-01-02",
  },
  {
    id: "p3",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    price: 124999,
    stock: 45,
    description:
      "Flagship Android smartphone featuring an advanced AI-powered camera system and a long-lasting battery.",
    imageUrls: [
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-03",
  },
  {
    id: "p4",
    name: "WH-1000XM6",
    brand: "Sony",
    price: 29999,
    stock: 8,
    description:
      "Industry-leading noise cancelling wireless headphones with exceptional sound quality and 30-hour battery life.",
    imageUrls: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-04",
  },
  {
    id: "p5",
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 134900,
    stock: 20,
    description:
      "Apple's most advanced iPhone with A18 Pro chip, titanium design, and a revolutionary camera control button.",
    imageUrls: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-05",
  },
  {
    id: "p6",
    name: "Slim Fit Chinos",
    brand: "Zara",
    price: 2499,
    stock: 30,
    description:
      "Classic slim-fit cotton chinos with a clean silhouette. Perfect for smart-casual occasions.",
    imageUrls: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-06",
  },
  {
    id: "p7",
    name: "Retro Classics",
    brand: "Puma",
    price: 3499,
    stock: 15,
    description:
      "Iconic retro-inspired sneakers with suede upper and signature Puma branding. A timeless wardrobe staple.",
    imageUrls: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-07",
  },
  {
    id: "p8",
    name: "501 Original Jeans",
    brand: "Levis",
    price: 3999,
    stock: 25,
    description:
      "The original straight-fit jean that started it all. Authentic five-pocket styling in classic denim.",
    imageUrls: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-08",
  },
  {
    id: "p9",
    name: "Urban Pullover",
    brand: "H&M",
    price: 1299,
    stock: 32,
    description:
      "Soft cotton blend pullover hoodie with a relaxed fit and minimal branding.",
    imageUrls: [
      "https://images.unsplash.com/photo-1631541909061-71e349d1f203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UHVsbG92ZXJ8ZW58MHx8MHx8fDA%3D",
    ],
    isAvailable: true,
    createdAt: "2024-01-09",
  },
  {
    id: "p10",
    name: "Minimalist Watch",
    brand: "Fossil",
    price: 8999,
    stock: 6,
    description:
      "Clean dial minimalist analog watch with genuine leather strap, perfect for everyday elegant wear.",
    imageUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-10",
  },
  {
    id: "p11",
    name: "AirPods Pro 2",
    brand: "Apple",
    price: 24999,
    stock: 18,
    description:
      "Second-generation AirPods Pro with Adaptive Transparency and Personalized Spatial Audio for immersive sound.",
    imageUrls: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-11",
  },
  {
    id: "p12",
    name: "Heritage Runner",
    brand: "Adidas",
    price: 4499,
    stock: 3,
    description:
      "Vintage-inspired running shoe with modern sole technology and an iconic three-stripe design.",
    imageUrls: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-12",
  },
  {
    id: "p13",
    name: "MacBook Air M3",
    brand: "Apple",
    price: 114900,
    stock: 10,
    description:
      "Incredibly thin and light laptop powered by the M3 chip with all-day battery life and a stunning Liquid Retina display.",
    imageUrls: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-13",
  },
  {
    id: "p14",
    name: "Graphic Tee",
    brand: "Zara",
    price: 899,
    stock: 50,
    description:
      "Oversized graphic cotton tee with abstract print. Versatile wardrobe essential for any casual look.",
    imageUrls: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2024-01-14",
  },
];