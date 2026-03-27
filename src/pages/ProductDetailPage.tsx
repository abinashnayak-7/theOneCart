import { useState, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  Grid,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import type{ Product, Page } from "../types";
import type{ RootState } from "../app/store";
import { StarIcon, PlusIcon, MinusIcon, ArrowRightIcon } from "../components/icons/Icons";

interface ProductDetailPageProps {
  product: Product;
  setPage: (p: Page) => void;
  onToast: (msg: string, severity?: "success" | "error" | "info") => void;
  onLoginRequired: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(rating)} />
      ))}
      <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
        {rating.toFixed(1)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        / 5.0
      </Typography>
    </Box>
  );
}

function stockInfo(stock: number) {
  if (stock === 0) return { text: "Out of stock", color: "error" as const };
  if (stock <= 15) return { text: `Only ${stock} left in stock`, color: "warning" as const };
  return { text: "In stock", color: "success" as const };
}

export default function ProductDetailPage({
  product,
  setPage,
  onToast,
  onLoginRequired,
}: ProductDetailPageProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const rating = useMemo(() => 3.4 + Math.random() * 1.6, []);
  const isDisabled = !product.isAvailable || product.stock === 0;
  const stock = stockInfo(product.stock);

  const handleAdd = () => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    onToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* ── Breadcrumb ── */}
      <Breadcrumbs
        separator={
          <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>
            <ArrowRightIcon />
          </Box>
        }
        sx={{ mb: 5 }}
      >
        <Link
          underline="hover"
          onClick={() => setPage("home")}
          sx={{ cursor: "pointer", color: "text.secondary", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em" }}
        >
          HOME
        </Link>
        <Link
          underline="hover"
          onClick={() => setPage("products")}
          sx={{ cursor: "pointer", color: "text.secondary", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em" }}
        >
          PRODUCTS
        </Link>
        <Typography sx={{ color: "text.primary", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em" }}>
          {product.name.toUpperCase()}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        {/* ── LEFT: Image panel ── */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
            {/* Main image */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
                mb: 1.5,
                aspectRatio: "4/3",
              }}
            >
              <Box
                component="img"
                src={product.imageUrls[activeImg]}
                alt={`${product.name} — image ${activeImg + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.25s ease",
                }}
              />

              {/* Unavailable overlay */}
              {!product.isAvailable && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.38)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      fontSize: "0.7rem",
                    }}
                  >
                    UNAVAILABLE
                  </Typography>
                </Box>
              )}

              {/* Image counter badge */}
              {product.imageUrls.length > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    px: 1.25,
                    py: 0.4,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  {activeImg + 1} / {product.imageUrls.length}
                </Box>
              )}
            </Box>

            {/* Thumbnail strip */}
            {product.imageUrls.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {product.imageUrls.map((url, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={url}
                    alt={`Thumbnail ${i + 1}`}
                    onClick={() => setActiveImg(i)}
                    sx={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: i === activeImg ? "primary.main" : "divider",
                      opacity: i === activeImg ? 1 : 0.55,
                      transition: "all 0.18s",
                      "&:hover": { opacity: 1, borderColor: "text.secondary" },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── RIGHT: Product info ── */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Brand + badges */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                label={product.brand.toUpperCase()}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.6rem", fontWeight: 700 }}
              />
              <Chip
                label={stock.text}
                size="small"
                color={stock.color}
                variant="filled"
                sx={{ fontSize: "0.6rem", fontWeight: 700 }}
              />
              {!product.isAvailable && (
                <Chip
                  label="UNAVAILABLE"
                  size="small"
                  color="default"
                  variant="outlined"
                  sx={{ fontSize: "0.6rem", fontWeight: 700 }}
                />
              )}
            </Box>

            {/* Name */}
            <Box>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, mb: 1.5 }}
              >
                {product.name}
              </Typography>
              <StarRating rating={rating} />
            </Box>

            {/* Price */}
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, letterSpacing: "-0.04em" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>
                Inclusive of all taxes · Free shipping
              </Typography>
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                  display: "block",
                  mb: 1.25,
                }}
              >
                DESCRIPTION
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.85 }}>
                {product.description}
              </Typography>
            </Box>

            <Divider />

            {/* Quantity + CTA */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                  display: "block",
                  mb: 1.5,
                }}
              >
                QUANTITY
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                {/* Qty selector */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <IconButton
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={isDisabled}
                    sx={{ borderRadius: 0, p: "10px" }}
                  >
                    <MinusIcon />
                  </IconButton>
                  <Box
                    component="input"
                    type="number"
                    value={qty}
                    disabled={isDisabled}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val)) return;
                      setQty(Math.min(product.stock, Math.max(1, val)));
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) setQty(1);
                    }}
                    sx={{
                      width: 48,
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontFamily: "inherit",
                      bgcolor: "transparent",
                      color: "text.primary",
                      p: 0,
                      cursor: isDisabled ? "not-allowed" : "text",
                      "MozAppearance": "textfield",
                      "&::-webkit-outer-spin-button": { display: "none" },
                      "&::-webkit-inner-spin-button": { display: "none" },
                    }}
                  />
                  <IconButton
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={isDisabled}
                    sx={{ borderRadius: 0, p: "10px" }}
                  >
                    <PlusIcon />
                  </IconButton>
                </Box>

                {/* Add to cart */}
                <Button
                  variant="contained"
                  size="large"
                  disabled={isDisabled}
                  onClick={handleAdd}
                  sx={{
                    flexGrow: 1,
                    minWidth: 180,
                    transition: "background-color 0.25s",
                    bgcolor: added ? "success.main" : undefined,
                    color: added ? "#fff" : undefined,
                    "&:hover": { bgcolor: added ? "success.dark" : undefined },
                  }}
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </Button>
              </Box>
            </Box>

            {/* Go to cart shortcut */}
            <Button
              variant="outlined"
              size="large"
              onClick={() => setPage("cart")}
              fullWidth
            >
              View Cart
            </Button>

            <Divider />

            {/* Meta info */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "text.secondary",
                  display: "block",
                  mb: 1.5,
                }}
              >
                PRODUCT DETAILS
              </Typography>
              <Stack spacing={1.25}>
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Availability", value: product.isAvailable ? "Available" : "Not Available" },
                  { label: "Stock", value: `${product.stock} units` },
                  {
                    label: "Added on",
                    value: new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  },
                  { label: "Product ID", value: product.id },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 100, flexShrink: 0, fontWeight: 500 }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: label === "Product ID" ? 400 : 600,
                        fontFamily: label === "Product ID" ? "monospace" : "inherit",
                        fontSize: label === "Product ID" ? "0.75rem" : "inherit",
                        color: label === "Availability"
                          ? product.isAvailable
                            ? "success.main"
                            : "error.main"
                          : "text.primary",
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}