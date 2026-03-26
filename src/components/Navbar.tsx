import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import type{ RootState } from "../app/store";
import type{ Page, ColorMode } from "../types";
import { CartIcon, SunIcon, MoonIcon } from "../components/icons/Icons";

interface NavbarProps {
  page: Page;
  setPage: (p: Page) => void;
  mode: ColorMode;
  toggleMode: () => void;
}

const NAV_LINKS: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "products", label: "Products" },
  { key: "add", label: "Add Product" },
];

export default function Navbar({
  page,
  setPage,
  mode,
  toggleMode,
}: NavbarProps) {
  const theme = useTheme();
  const cartCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          minHeight: { xs: 56, md: 64 },
          gap: 1,
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => setPage("home")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              TO
            </Typography>
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "0.12em",
              display: { xs: "none", sm: "block" },
            }}
          >
            THEONE
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Nav links */}
        <Stack
          direction="row"
          sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
        >
          {NAV_LINKS.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => setPage(key)}
              size="small"
              disableRipple
              sx={{
                color: page === key ? "primary.main" : "text.secondary",
                fontWeight: page === key ? 700 : 500,
                px: 2,
                borderRadius: 0,
                borderBottom: "2px solid",
                borderColor: page === key ? "primary.main" : "transparent",
                pb: "3px",
                transition: "color 0.15s, border-color 0.15s",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "text.primary",
                  borderColor: "divider",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        {/* Theme toggle */}
        <IconButton
          onClick={toggleMode}
          size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          aria-label="Toggle color mode"
        >
          {mode === "light" ? <MoonIcon /> : <SunIcon />}
        </IconButton>

        {/* Cart */}
        <IconButton
          onClick={() => setPage("cart")}
          sx={{ color: "text.primary", ml: 0.5 }}
          aria-label="Open cart"
        >
          <CartIcon count={cartCount} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}