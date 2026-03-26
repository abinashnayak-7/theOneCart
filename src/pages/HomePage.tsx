import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, addRecentSearch } from "../store/searchSlice";
import type{ RootState } from "../app/store";
import type{ Page } from "../types";
import { SearchIcon } from "../components/icons/Icons";

interface HomePageProps {
  setPage: (p: Page) => void;
}

const STATS = [
  { value: "14+", label: "Products" },
  { value: "10+", label: "Brands" },
  { value: "Free", label: "Returns" },
  { value: "24/7", label: "Support" },
];

export default function HomePage({ setPage }: HomePageProps) {
  const dispatch = useDispatch();
  const recentSearches = useSelector((s: RootState) => s.search.recentSearches);
  const [input, setInput] = useState("");

  const handleSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    dispatch(addRecentSearch(t));
    dispatch(setQuery(t));
    setPage("products");
  };

  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(160deg, #0a0a0a 0%, #141414 60%, #0a0a0a 100%)"
              : "linear-gradient(160deg, #f5f5f5 0%, #fafafa 60%, #f0f0f0 100%)",
        }}
      >
        {/* Subtle grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            color: "text.primary",
            pointerEvents: "none",
          }}
        />

        {/* Large decorative numeral */}
        <Typography
          sx={{
            position: "absolute",
            right: { xs: "-5%", md: "5%" },
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: { xs: "18rem", md: "24rem" },
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.08em",
            opacity: 0.04,
            userSelect: "none",
            pointerEvents: "none",
            color: "text.primary",
          }}
        >
          TO
        </Typography>

        <Container maxWidth="md" sx={{ position: "relative", py: { xs: 8, md: 12 } }}>
          <Typography
            variant="caption"
            sx={{
              letterSpacing: "0.22em",
              color: "text.secondary",
              fontWeight: 700,
              display: "block",
              mb: 3,
            }}
          >
            PREMIUM COMMERCE
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
              lineHeight: 1.04,
              mb: 4,
            }}
          >
            Shop Without
            <br />
            <Box component="span" sx={{ fontWeight: 800 }}>
              Noise.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 460, lineHeight: 1.8 }}
          >
            Curated products, clean presentation. Find exactly what you need,
            nothing you don't.
          </Typography>

          {/* Search bar */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              maxWidth: 520,
              mb: recentSearches.length > 0 ? 2 : 0,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search for products, brands..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ color: "text.secondary", display: "flex" }}>
                      <SearchIcon />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "background.paper" }}
            />
            <Button
              variant="contained"
              onClick={() => handleSearch(input)}
              sx={{ whiteSpace: "nowrap", px: 3, flexShrink: 0 }}
            >
              Search
            </Button>
          </Box>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: "0.1em" }}
              >
                RECENT:
              </Typography>
              {recentSearches.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSearch(s)}
                  sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Stats bar ── */}
      <Box sx={{ borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg" disableGutters>
          <Grid container>
            {STATS.map(({ value, label }, i) => (
              <Grid item xs={6} md={3} key={label}>
                <Box
                  sx={{
                    py: 3.5,
                    textAlign: "center",
                    borderRight: i < 3 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, letterSpacing: "-0.05em" }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: "0.14em" }}
                  >
                    {label.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 200, mb: 1.5, letterSpacing: "-0.04em" }}
        >
          Ready to explore?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Browse our full catalog of curated products.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setPage("products")}
          sx={{ px: 7 }}
        >
          Browse All Products
        </Button>
      </Container>
    </Box>
  );
}