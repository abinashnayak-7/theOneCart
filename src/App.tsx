import { useState, useEffect, useMemo } from "react";
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type{ RootState } from "./app/store";
import { clearCart, loadUserCart } from "./store/cartSlice";
import { getTheme } from "./theme/theme";
import type{ ColorMode, OrderDetails, Page } from "./types";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ProductDetailPage from "./pages/ProductDetailPage";

interface SnackState {
  open: boolean;
  msg: string;
  severity: "success" | "error" | "info" | "warning";
}
 
// Pages that require the user to be logged in
const PROTECTED: Page[] = ["cart", "checkout", "confirmation"];
 
export default function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
 
  const [mode, setMode] = useState<ColorMode>("light");
  const [page, setPage] = useState<Page>("home");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<import("./types").Product | null>(null);
  const [snack, setSnack] = useState<SnackState>({
    open: false,
    msg: "",
    severity: "success",
  });
 
  const theme = useMemo(() => getTheme(mode), [mode]);
 
  // ── Rehydrate cart when a session is already persisted (e.g. after page refresh) ──
  useEffect(() => {
    if (currentUser) {
      dispatch(loadUserCart(currentUser.id));
    }
  }, []); // runs once on mount only
 
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));
 
  const toast = (
    msg: string,
    severity: SnackState["severity"] = "success"
  ) => setSnack({ open: true, msg, severity });
 
  // Navigate — redirect to login if protected and not logged in
  const navigate = (p: Page) => {
    if (PROTECTED.includes(p) && !currentUser) {
      setPage("login");
      toast("Please sign in to continue.", "info");
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleLoginRequired = () => {
    navigate("login");
    toast("Please sign in to add items to your cart.", "info");
  };
 
  const handleViewDetail = (product: import("./types").Product) => {
    setSelectedProduct(product);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleConfirmOrder = (details: OrderDetails) => {
    setOrderDetails(details);
    setPage("confirmation");
  };
 
  const handleClearAfterConfirm = () => {
    dispatch(clearCart());
  };
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
 
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "background-color 0.25s ease, color 0.25s ease",
        }}
      >
        {/* Login page — full-screen, no Navbar/Footer */}
        {page === "login" ? (
          <LoginPage
            setPage={navigate}
            onSuccess={() => {
              toast("Welcome back!", "success");
              navigate("home");
            }}
          />
        ) : (
          <>
            <Navbar
              page={page}
              setPage={navigate}
              mode={mode}
              toggleMode={toggleMode}
            />
 
            <Box component="main" sx={{ flexGrow: 1 }}>
              {page === "home" && <HomePage setPage={navigate} />}
 
              {page === "products" && (
                <ProductsPage
                  onToast={toast}
                  onViewDetail={handleViewDetail}
                  onLoginRequired={handleLoginRequired}
                />
              )}
 
              {page === "detail" && selectedProduct && (
                <ProductDetailPage
                  product={selectedProduct}
                  setPage={navigate}
                  onToast={toast}
                  onLoginRequired={handleLoginRequired}
                />
              )}
 
              {page === "add" && (
                <AddProductPage setPage={navigate} onToast={toast} />
              )}
 
              {page === "cart" && (
                <CartPage setPage={navigate} onToast={toast} />
              )}
 
              {page === "checkout" && (
                <CheckoutPage setPage={navigate} onConfirm={handleConfirmOrder} />
              )}
 
              {page === "confirmation" && (
                <ConfirmationPage
                  orderDetails={orderDetails}
                  setPage={navigate}
                  onClear={handleClearAfterConfirm}
                />
              )}
            </Box>
 
            <Footer setPage={navigate} />
          </>
        )}
      </Box>
 
      {/* Global Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2800}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 1, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}