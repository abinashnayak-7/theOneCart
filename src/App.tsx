import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearCart } from "./store/cartSlice";
import { getTheme } from "./theme/theme";
import type{ ColorMode, OrderDetails, Page } from "./types";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

interface SnackState {
  open: boolean;
  msg: string;
  severity: "success" | "error" | "info" | "warning";
}

export default function App() {
  const dispatch = useDispatch();

  const [mode, setMode] = useState<ColorMode>("light");
  const [page, setPage] = useState<Page>("home");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [snack, setSnack] = useState<SnackState>({
    open: false,
    msg: "",
    severity: "success",
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleMode = () =>
    setMode((m) => (m === "light" ? "dark" : "light"));

  const toast = (
    msg: string,
    severity: SnackState["severity"] = "success"
  ) => setSnack({ open: true, msg, severity });

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
        {/* ── Navigation ── */}
        <Navbar
          page={page}
          setPage={setPage}
          mode={mode}
          toggleMode={toggleMode}
        />

        {/* ── Page content ── */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {page === "home" && (
            <HomePage setPage={setPage} />
          )}

          {page === "products" && (
            <ProductsPage onToast={toast} />
          )}

          {page === "add" && (
            <AddProductPage setPage={setPage} onToast={toast} />
          )}

          {page === "cart" && (
            <CartPage setPage={setPage} onToast={toast} />
          )}

          {page === "checkout" && (
            <CheckoutPage setPage={setPage} onConfirm={handleConfirmOrder} />
          )}

          {page === "confirmation" && (
            <ConfirmationPage
              orderDetails={orderDetails}
              setPage={setPage}
              onClear={handleClearAfterConfirm}
            />
          )}
        </Box>

        {/* ── Footer ── */}
        <Footer setPage={setPage} />
      </Box>

      {/* ── Global Snackbar ── */}
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