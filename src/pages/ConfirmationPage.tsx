import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import type { OrderDetails, Page } from "../types";
import { CheckCircleIcon } from "../components/icons/Icons";
import { clearCart } from "../store/cartSlice"; // adjust path if needed

interface ConfirmationPageProps {
  orderDetails: OrderDetails | null;
  setPage: (p: Page) => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  upi: "UPI",
};

export default function ConfirmationPage({
  orderDetails,
  setPage,
}: ConfirmationPageProps) {
  const dispatch = useDispatch();
  const orderId = `KRT-${Date.now().toString().slice(-8).toUpperCase()}`;

  useEffect(() => {
    dispatch(clearCart());
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      {/* Success icon */}
      <Box
        sx={{
          width: 88,
          height: 88,
          mx: "auto",
          mb: 4,
          border: "1.5px solid",
          borderColor: "success.main",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "success.main",
        }}
      >
        <CheckCircleIcon />
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 300, mb: 1, letterSpacing: "-0.03em" }}
      >
        Order Confirmed
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 1 }}
      >
        {orderDetails?.name
          ? `Thank you, ${orderDetails.name}!`
          : "Thank you for your order!"}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 6 }}
      >
        Your order is being processed and will be on its way soon.
      </Typography>

      {/* Order detail card */}
      <Paper
        variant="outlined"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 4,
        }}
      >
        {/* Order ID header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, letterSpacing: "0.12em", color: "text.secondary" }}
          >
            ORDER ID
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.06em" }}
          >
            {orderId}
          </Typography>
        </Box>

        {/* Details */}
        <Stack sx={{ p: 3 }} spacing={2}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "text.secondary",
                display: "block",
                mb: 0.75,
              }}
            >
              DELIVERY ADDRESS
            </Typography>
            <Typography variant="body2">{orderDetails?.address}</Typography>
            <Typography variant="body2" color="text.secondary">
              {orderDetails?.city} — {orderDetails?.zip}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "text.secondary",
                display: "block",
                mb: 0.75,
              }}
            >
              PAYMENT METHOD
            </Typography>
            <Typography variant="body2">
              {PAYMENT_LABELS[orderDetails?.payment ?? "cod"]}
            </Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "text.secondary",
              }}
            >
              ESTIMATED DELIVERY
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              3–5 business days
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Actions */}
      <Stack spacing={1.5}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => setPage("home")}
        >
          Continue Shopping
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => setPage("products")}
        >
          Browse More Products
        </Button>
      </Stack>
    </Container>
  );
}