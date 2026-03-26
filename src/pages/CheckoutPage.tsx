import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import type{ RootState } from "../app/store";
import type{ OrderDetails, Page } from "../types";

interface CheckoutPageProps {
  setPage: (p: Page) => void;
  onConfirm: (details: OrderDetails) => void;
}

interface FormState {
  name: string;
  address: string;
  city: string;
  zip: string;
  payment: "cod" | "card" | "upi";
}

interface FormErrors {
  name?: string;
  address?: string;
  city?: string;
  zip?: string;
}

const PAYMENT_OPTIONS: { value: "cod" | "card" | "upi"; label: string; sub: string }[] = [
  { value: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives" },
  { value: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay" },
  { value: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm, BHIM" },
];

export default function CheckoutPage({ setPage, onConfirm }: CheckoutPageProps) {
  const { items, discount } = useSelector((s: RootState) => s.cart);

  const [form, setForm] = useState<FormState>({
    name: "",
    address: "",
    city: "",
    zip: "",
    payment: "cod",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.zip.trim()) e.zip = "PIN code is required";
    else if (!/^\d{6}$/.test(form.zip.trim())) e.zip = "Enter a valid 6-digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm({ ...form });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Typography variant="h4" sx={{ letterSpacing: "-0.03em", mb: 0.75 }}>
        Checkout
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
        Review your order and fill in your delivery details.
      </Typography>

      <Grid container spacing={5}>
        {/* ── Left: Address + Payment ── */}
        <Grid item xs={12} md={7}>
          <Stack spacing={5}>
            {/* Delivery */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                  display: "block",
                  mb: 2.5,
                }}
              >
                DELIVERY ADDRESS
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Street Address"
                  fullWidth
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                />
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      label="City"
                      fullWidth
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="PIN Code"
                      fullWidth
                      value={form.zip}
                      onChange={(e) => set("zip", e.target.value)}
                      error={!!errors.zip}
                      helperText={errors.zip}
                      inputProps={{ maxLength: 6 }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <Divider />

            {/* Payment */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                  display: "block",
                  mb: 2.5,
                }}
              >
                PAYMENT METHOD
              </Typography>
              <RadioGroup
                value={form.payment}
                onChange={(e) => set("payment", e.target.value as FormState["payment"])}
              >
                <Stack spacing={1.25}>
                  {PAYMENT_OPTIONS.map(({ value, label, sub }) => (
                    <Paper
                      key={value}
                      variant="outlined"
                      onClick={() => set("payment", value)}
                      sx={{
                        border: "1px solid",
                        borderColor:
                          form.payment === value ? "primary.main" : "divider",
                        px: 2,
                        py: 0.5,
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                        "&:hover": { borderColor: "text.secondary" },
                      }}
                    >
                      <FormControlLabel
                        value={value}
                        control={<Radio size="small" />}
                        label={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, lineHeight: 1.3 }}
                            >
                              {label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {sub}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0, py: 0.75 }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleConfirm}
            >
              Confirm Order
            </Button>

            <Button
              size="small"
              onClick={() => setPage("cart")}
              sx={{ color: "text.secondary", mt: -1 }}
            >
              ← Back to Cart
            </Button>
          </Stack>
        </Grid>

        {/* ── Right: Summary ── */}
        <Grid item xs={12} md={5}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              position: "sticky",
              top: 88,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Order Summary
            </Typography>

            <Stack spacing={1.75} divider={<Divider />}>
              {items.map(({ product, quantity }) => (
                <Box
                  key={product.id}
                  sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                >
                  <Box
                    component="img"
                    src={product.imageUrls[0]}
                    alt={product.name}
                    sx={{
                      width: 44,
                      height: 44,
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, flexShrink: 0 }}>
                    ₹{(product.price * quantity).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={1.5}>
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
                    Discount
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    −₹{discount.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  Free
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
                  ₹{total.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}