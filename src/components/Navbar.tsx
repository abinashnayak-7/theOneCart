import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../store/authSlice";
import { unloadUserCart } from "../store/cartSlice";
import type { Page, ColorMode } from "../types";
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar({
  page,
  setPage,
  mode,
  toggleMode,
}: NavbarProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s: RootState) => s.auth.currentUser);
  const cartCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(unloadUserCart());
    setAnchorEl(null);
    setPage("home");
  };

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
        >
          {mode === "light" ? <MoonIcon /> : <SunIcon />}
        </IconButton>

        {/* Cart */}
        <IconButton
          onClick={() => {
            if (!currentUser) {
              setPage("login");
              return;
            }
            setPage("cart");
          }}
          sx={{ color: "text.primary", ml: 0.5 }}
        >
          <CartIcon count={currentUser ? cartCount : 0} />
        </IconButton>

        {/* User avatar / login button */}
        {currentUser ? (
          <>
            <Tooltip title={currentUser.name}>
              <Avatar
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  width: 32,
                  height: 32,
                  ml: 0.5,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  border: "2px solid",
                  borderColor:
                    page === "login" ? "primary.main" : "transparent",
                  transition: "border-color 0.15s",
                  "&:hover": { borderColor: "text.secondary" },
                }}
              >
                {getInitials(currentUser.name)}
              </Avatar>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  minWidth: 200,
                  borderRadius: 1,
                  mt: 0.75,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* User info header */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {currentUser.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser.email}
                </Typography>
              </Box>

              <Divider />

              <MenuItem
                onClick={() => {
                  setPage("cart");
                  setAnchorEl(null);
                }}
                sx={{ fontSize: "0.85rem", py: 1.25 }}
              >
                My Cart
                {cartCount > 0 && (
                  <Box
                    sx={{
                      ml: "auto",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    {cartCount}
                  </Box>
                )}
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleLogout}
                sx={{ fontSize: "0.85rem", py: 1.25, color: "error.main" }}
              >
                Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage("login")}
            sx={{ ml: 0.5, borderColor: "divider", color: "text.secondary" }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
