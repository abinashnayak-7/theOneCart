import { useState, useMemo } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import type{ Product } from "../types";
import { StarIcon, PlusIcon, MinusIcon } from "../components/icons/Icons";

interface ProductCardProps {
  product: Product;
  onToast: (msg: string, severity?: "success" | "error" | "info") => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, color: "text.secondary" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(rating)} />
      ))}
      <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
        ({rating.toFixed(1)})
      </Typography>
    </Box>
  );
}

function stockInfo(stock: number) {
  if (stock === 0) return { text: "Out of stock", color: "error" as const };
  if (stock <= 15) return { text: `Only ${stock} left`, color: "warning" as const };
  return { text: "In stock", color: "success" as const };
}

export default function ProductCard({ product, onToast }: ProductCardProps) {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  // stable random rating per mount
  const rating = useMemo(() => 3.4 + Math.random() * 1.6, []);
  const isDisabled = !product.isAvailable || product.stock === 0;
  const stock = stockInfo(product.stock);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: qty }));
    onToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: isDisabled ? "none" : "translateY(-3px)",
          borderColor: isDisabled ? undefined : "text.secondary",
        },
        opacity: isDisabled ? 0.52 : 1,
      }}
    >
      {/* ── Image ── */}
      <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "action.hover" }}>
        <CardMedia
          component="img"
          height="210"
          image={product.imageUrls[imgIdx]}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.35s ease",
            "&:hover": { transform: "scale(1.04)" },
          }}
        />

        {/* Unavailable overlay */}
        {!product.isAvailable && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.2em",
                fontSize: "0.65rem",
              }}
            >
              UNAVAILABLE
            </Typography>
          </Box>
        )}

        {/* Dot navigation for multiple images */}
        {product.imageUrls.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 0.75,
            }}
          >
            {product.imageUrls.map((_, i) => (
              <Box
                key={i}
                onClick={() => setImgIdx(i)}
                sx={{
                  width: i === imgIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 4,
                  bgcolor: i === imgIdx ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ── Content ── */}
      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
            gap: 1,
          }}
        >
          <Chip
            label={product.brand.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.58rem" }}
          />
          <Chip
            label={stock.text}
            size="small"
            color={stock.color}
            variant="filled"
            sx={{ fontSize: "0.58rem", flexShrink: 0 }}
          />
        </Box>

        <Tooltip title={product.description} placement="top" arrow enterDelay={400}>
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, mb: 0.5, fontWeight: 700, lineHeight: 1.35, cursor: "default" }}
          >
            {product.name}
          </Typography>
        </Tooltip>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.73rem",
            mb: 1.5,
            lineHeight: 1.55,
          }}
        >
          {product.description}
        </Typography>

        <StarRating rating={rating} />

        <Typography
          variant="h6"
          sx={{ mt: 1.5, fontWeight: 800, letterSpacing: "-0.03em", fontSize: "1.1rem" }}
        >
          ₹{product.price.toLocaleString("en-IN")}
        </Typography>
      </CardContent>

      {/* ── Actions ── */}
      <CardActions sx={{ p: 2, pt: 1, gap: 1 }}>
        {/* Quantity selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={isDisabled}
            sx={{ borderRadius: 0, p: "5px" }}
          >
            <MinusIcon />
          </IconButton>
          <Typography
            sx={{
              px: 1.25,
              fontSize: "0.82rem",
              fontWeight: 700,
              minWidth: 26,
              textAlign: "center",
              userSelect: "none",
            }}
          >
            {qty}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={isDisabled}
            sx={{ borderRadius: 0, p: "5px" }}
          >
            <PlusIcon />
          </IconButton>
        </Box>

        {/* Add to cart */}
        <Button
          variant="contained"
          size="small"
          fullWidth
          disabled={isDisabled}
          onClick={handleAdd}
          sx={{
            transition: "background-color 0.25s",
            bgcolor: added ? "success.main" : undefined,
            color: added ? "#fff" : undefined,
            "&:hover": { bgcolor: added ? "success.dark" : undefined },
          }}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
}