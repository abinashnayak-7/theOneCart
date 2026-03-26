import type{ Theme } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles"
import type{ ColorMode } from "../types";

export const getTheme = (mode: ColorMode): Theme =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#111111", contrastText: "#ffffff" },
            secondary: { main: "#555555" },
            background: { default: "#fafafa", paper: "#ffffff" },
            text: { primary: "#111111", secondary: "#666666" },
            divider: "#e8e8e8",
            success: { main: "#2e7d32" },
            warning: { main: "#e65100" },
            error: { main: "#c62828" },
          }
        : {
            primary: { main: "#f0f0f0", contrastText: "#111111" },
            secondary: { main: "#999999" },
            background: { default: "#0a0a0a", paper: "#141414" },
            text: { primary: "#f0f0f0", secondary: "#888888" },
            divider: "#2a2a2a",
            success: { main: "#66bb6a" },
            warning: { main: "#ffa726" },
            error: { main: "#ef5350" },
          }),
    },
    typography: {
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      h1: { fontWeight: 200, letterSpacing: "-0.05em" },
      h2: { fontWeight: 300, letterSpacing: "-0.04em" },
      h3: { fontWeight: 300, letterSpacing: "-0.03em" },
      h4: { fontWeight: 300, letterSpacing: "-0.025em" },
      h5: { fontWeight: 500, letterSpacing: "-0.015em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      body1: { letterSpacing: "0.01em", lineHeight: 1.75 },
      body2: { letterSpacing: "0.005em", lineHeight: 1.65 },
      caption: { letterSpacing: "0.04em", lineHeight: 1.5 },
      button: {
        letterSpacing: "0.1em",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "0.68rem",
      },
    },
    shape: { borderRadius: 2 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor:
              mode === "light" ? "#c0c0c0 transparent" : "#444 transparent",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "light" ? "#e8e8e8" : "#2a2a2a"}`,
            backdropFilter: "blur(12px)",
            backgroundColor:
              mode === "light"
                ? "rgba(250,250,250,0.88)"
                : "rgba(10,10,10,0.88)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            padding: "10px 24px",
            boxShadow: "none",
            "&:hover": { boxShadow: "none", opacity: 0.88 },
          },
          sizeSmall: { padding: "6px 16px" },
          sizeLarge: { padding: "14px 32px" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            border: `1px solid ${mode === "light" ? "#e8e8e8" : "#2a2a2a"}`,
            borderRadius: 2,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { boxShadow: "none" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "0.875rem",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "0.62rem",
            letterSpacing: "0.08em",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === "light" ? "#e8e8e8" : "#2a2a2a",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 4 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 2,
            fontSize: "0.75rem",
            backgroundColor: mode === "light" ? "#111" : "#f0f0f0",
            color: mode === "light" ? "#fff" : "#111",
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": { borderRadius: 2 },
          },
        },
      },
    },
  });