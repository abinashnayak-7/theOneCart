import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Divider,
  Paper,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  clearCoupon,
} from "../store/cartSlice";
import type { Page } from "../types";
import { COUPONS } from "../data/seedData";
import { PlusIcon, MinusIcon, TrashIcon } from "../components/icons/Icons";

interface CartPageProps {
  setPage: (p: Page) => void;
  onToast: (msg: string, severity?: "success" | "error" | "info") => void;
}

export default function CartPage({ setPage, onToast }: CartPageProps) {
  const dispatch = useDispatch();
  const { items, couponCode, discount } = useSelector((s: RootState) => s.cart);

  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(
    couponCode
      ? { text: `✓ "${couponCode}" applied — ₹${discount} off`, ok: true }
      : null,
  );
  const [clearDialog, setClearDialog] = useState(false);

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const disc = COUPONS[code];
    if (disc !== undefined) {
      dispatch(applyCoupon({ code, discount: disc }));
      setCouponMsg({ text: `✓ "${code}" applied — ₹${disc} off`, ok: true });
    } else {
      dispatch(clearCoupon());
      setCouponMsg({ text: "Invalid coupon code.", ok: false });
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponInput("");
    setCouponMsg(null);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 14, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 200, mb: 1.5 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
          Add some products to get started.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setPage("products")}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 5,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ letterSpacing: "-0.03em" }}>
            Your Cart
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </Typography>
        </Box>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => setClearDialog(true)}
        >
          Clear all
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* ── Cart Items ── */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {items.map(({ product, quantity }, i) => (
              <Box key={product.id}>
                {i > 0 && <Divider />}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2.5,
                    alignItems: "center",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {/* Image */}
                  <Box
                    component="img"
                    src={product.imageUrls[0]}
                    alt={product.name}
                    sx={{
                      width: 76,
                      height: 76,
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />

                  {/* Details */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{ fontWeight: 700, mb: 0.25 }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.brand}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, mt: 0.5 }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </Typography>
                  </Box>

                  {/* Qty control */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ borderRadius: 0, p: "5px" }}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity - 1,
                          }),
                        )
                      }
                    >
                      <MinusIcon />
                    </IconButton>
                    <Typography
                      sx={{
                        px: 1.5,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        minWidth: 28,
                        textAlign: "center",
                        userSelect: "none",
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ borderRadius: 0, p: "5px" }}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity + 1,
                          }),
                        )
                      }
                    >
                      <PlusIcon />
                    </IconButton>
                  </Box>

                  {/* Line total + remove */}
                  <Box
                    sx={{
                      textAlign: "right",
                      flexShrink: 0,
                      minWidth: 80,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ color: "error.main", mt: 0.5 }}
                      onClick={() => {
                        dispatch(removeFromCart(product.id));
                        onToast("Item removed", "info");
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* ── Order Summary ── */}
        <Grid item xs={12} md={5}>
          <Paper
            variant="outlined"
            sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Order Summary
            </Typography>

            {/* Coupon */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "text.secondary",
                display: "block",
                mb: 1.25,
              }}
            >
              COUPON CODE
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. FLAT10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                inputProps={{
                  style: { fontFamily: "monospace", fontWeight: 600 },
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleApplyCoupon}
                sx={{ flexShrink: 0 }}
              >
                Apply
              </Button>
            </Box>

            {couponMsg && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="caption"
                  color={couponMsg.ok ? "success.main" : "error.main"}
                  sx={{ fontWeight: 600 }}
                >
                  {couponMsg.text}
                </Typography>
                {couponMsg.ok && (
                  <Button
                    size="small"
                    color="error"
                    sx={{ minWidth: 0, p: 0, fontSize: "0.65rem" }}
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            )}

            {/* Available coupons hint */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
              {Object.entries(COUPONS).map(([code, val]) => (
                <Chip
                  key={code}
                  label={`${code} · −₹${val}`}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setCouponInput(code);
                  }}
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.62rem",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* Totals */}
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </Typography>
              </Box>

              {discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="success.main">
                    Coupon discount
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    −₹{discount.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontWeight: 600 }}
                >
                  Free
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                setPage("checkout");
                clearCart();
              }}
              sx={{ mt: 3.5 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              size="small"
              fullWidth
              onClick={() => setPage("products")}
              sx={{ mt: 1.5, color: "text.secondary" }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Clear Cart Dialog ── */}
      <Dialog
        open={clearDialog}
        onClose={() => setClearDialog(false)}
        PaperProps={{ sx: { border: "1px solid", borderColor: "divider" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Clear cart?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove all{" "}
            <strong>{items.length} items</strong> from your cart. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setClearDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              dispatch(clearCart());
              setClearDialog(false);
              onToast("Cart cleared", "info");
            }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
