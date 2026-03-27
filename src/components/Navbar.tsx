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
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          minHeight: { xs: 64, md: 72 },
          gap: 1.5,
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
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                fontWeight: 900,
                fontSize: "0.95rem",
                letterSpacing: "-0.05em",
              }}
            >
              TO
            </Typography>
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.08em",
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
          sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}
        >
          {NAV_LINKS.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => setPage(key)}
              disableRipple
              sx={{
                color: page === key ? "primary.main" : "text.secondary",
                fontWeight: page === key ? 700 : 600,
                px: 2.5,
                py: 1,
                borderRadius: 0,
                position: "relative",
                borderBottom: "3px solid",
                borderColor: page === key ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "text.primary",
                  borderColor: page === key ? "primary.main" : "divider",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        {/* Right side actions */}
        <Stack direction="row" alignItems="center" gap={0.5}>
          {/* Theme toggle - Fixed icon size */}
          <IconButton
            onClick={toggleMode}
            size="medium"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ fontSize: 24, display: "flex", alignItems: "center" }}>
              {mode === "light" ? <MoonIcon /> : <SunIcon />}
            </Box>
          </IconButton>

          {/* Cart - Fixed icon size */}
          <IconButton
            onClick={() => {
              if (!currentUser) {
                setPage("login");
                return;
              }
              setPage("cart");
            }}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ fontSize: 24, display: "flex", alignItems: "center" }}>
              <CartIcon count={currentUser ? cartCount : 0} />
            </Box>
          </IconButton>

          {/* User avatar / login button */}
          {currentUser ? (
            <>
              <Tooltip title={currentUser.name}>
                <Avatar
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    width: 36,
                    height: 36,
                    ml: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "scale(1.06)",
                    },
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
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                    minWidth: 220,
                    borderRadius: 2,
                    mt: 1,
                    overflow: "hidden",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
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
                  sx={{ py: 1.5 }}
                >
                  My Cart
                  {cartCount > 0 && (
                    <Box
                      sx={{
                        ml: "auto",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        borderRadius: "9999px",
                        minWidth: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        px: 1,
                      }}
                    >
                      {cartCount}
                    </Box>
                  )}
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                  }}
                  sx={{ py: 1.5 }}
                >
                  Profile
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: "error.main",
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "error.contrastText",
                    },
                  }}
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
              sx={{
                ml: 1,
                borderColor: "divider",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "text.primary",
                  color: "text.primary",
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
