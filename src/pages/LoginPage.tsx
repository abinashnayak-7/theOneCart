import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "../store/authSlice";
import { loadUserCart } from "../store/cartSlice";
import type{ RootState } from "../app/store";
import type{ Page } from "../types";

// Eye / eye-off icons inline
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

interface LoginPageProps {
  setPage: (p: Page) => void;
  onSuccess: () => void;
}

type Tab = "login" | "register";

export default function LoginPage({ setPage, onSuccess }: LoginPageProps) {
  const dispatch = useDispatch();
  const { error, currentUser } = useSelector((s: RootState) => s.auth);

  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [localError, setLocalError] = useState("");

  // If login succeeded, load that user's cart and navigate
  useEffect(() => {
    if (currentUser) {
      dispatch(loadUserCart(currentUser.id));
      onSuccess();
    }
  }, [currentUser]);

  // Clear redux error when switching tabs
  const switchTab = (t: Tab) => {
    setTab(t);
    setLocalError("");
    dispatch(clearError());
  };

  const handleLogin = () => {
    setLocalError("");
    dispatch(clearError());
    if (!loginEmail.trim() || !loginPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }
    dispatch(login({ email: loginEmail.trim(), password: loginPassword }));
  };

  const handleRegister = () => {
    setLocalError("");
    dispatch(clearError());
    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirm) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (regPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    dispatch(register({ name: regName.trim(), email: regEmail.trim(), password: regPassword }));
  };

  const displayError = localError || error;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(160deg, #0a0a0a 0%, #141414 100%)"
            : "linear-gradient(160deg, #f5f5f5 0%, #fafafa 100%)",
        py: 8,
      }}
    >
      {/* Background grid texture */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "text.primary",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xs" sx={{ position: "relative" }}>
        {/* Logo */}
        <Box
          onClick={() => setPage("home")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 5,
            cursor: "pointer",
            justifyContent: "center",
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
            }}
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                fontWeight: 900,
                fontSize: "0.9rem",
                letterSpacing: "-0.06em",
              }}
            >
              K
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "0.12em" }}>
            KART
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: { xs: 3, sm: 4 },
          }}
        >
          {/* Tab switcher */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "1px solid",
              borderColor: "divider",
              mb: 4,
            }}
          >
            {(["login", "register"] as Tab[]).map((t) => (
              <Button
                key={t}
                disableRipple
                onClick={() => switchTab(t)}
                sx={{
                  borderRadius: 0,
                  py: 1.25,
                  bgcolor: tab === t ? "primary.main" : "transparent",
                  color: tab === t ? "primary.contrastText" : "text.secondary",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  fontSize: "0.68rem",
                  "&:hover": {
                    bgcolor: tab === t ? "primary.main" : "action.hover",
                  },
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </Button>
            ))}
          </Box>

          {/* Error */}
          {displayError && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: 1, fontSize: "0.8rem" }}
              onClose={() => { setLocalError(""); dispatch(clearError()); }}
            >
              {displayError}
            </Alert>
          )}

          {/* ── Login Form ── */}
          {tab === "login" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 0.5 }}
                >
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to access your cart and orders.
                </Typography>
              </Box>

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="email"
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((s) => !s)}
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 0.5 }}
              >
                Sign In
              </Button>

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Don't have an account?{" "}
                <Box
                  component="span"
                  onClick={() => switchTab("register")}
                  sx={{
                    color: "text.primary",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Register
                </Box>
              </Typography>
            </Stack>
          )}

          {/* ── Register Form ── */}
          {tab === "register" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 0.5 }}
                >
                  Create account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your cart is saved and private to you.
                </Typography>
              </Box>

              <TextField
                label="Full Name"
                fullWidth
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                autoComplete="name"
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                autoComplete="email"
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                helperText="Minimum 6 characters"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((s) => !s)}
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                autoComplete="new-password"
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleRegister}
                sx={{ mt: 0.5 }}
              >
                Create Account
              </Button>

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => switchTab("login")}
                  sx={{
                    color: "text.primary",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Sign In
                </Box>
              </Typography>
            </Stack>
          )}
        </Box>

        {/* Guest note */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
          You can browse products without signing in.{" "}
          <Box
            component="span"
            onClick={() => setPage("products")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            Continue as guest
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}