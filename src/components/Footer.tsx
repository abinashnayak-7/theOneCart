import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import type{ Page } from "../types";

interface FooterProps {
  setPage: (p: Page) => void;
}

const SHOP_LINKS: { key: Page; label: string }[] = [
  { key: "products", label: "All Products" },
  { key: "add", label: "Add Product" },
  { key: "cart", label: "Cart" },
];

const INFO_LINKS = ["About Us", "Contact", "Returns & Refunds", "Privacy Policy"];

export default function Footer({ setPage }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{ borderTop: "1px solid", borderColor: "divider", mt: "auto", pt: 6, pb: 4 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
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
                    fontSize: "0.7rem",
                    letterSpacing: "-0.04em",
                  }}
                >
                  TO
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em" }}>
                THEONE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, lineHeight: 1.8 }}>
              A minimalist shopping experience. Quality products, thoughtfully presented, honestly priced.
            </Typography>
          </Grid>

          {/* Shop */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "text.secondary",
                display: "block",
                mb: 2,
              }}
            >
              SHOP
            </Typography>
            <Stack spacing={1.25}>
              {SHOP_LINKS.map(({ key, label }) => (
                <Typography
                  key={key}
                  variant="body2"
                  color="text.secondary"
                  onClick={() => setPage(key)}
                  sx={{
                    cursor: "pointer",
                    transition: "color 0.15s",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Info */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "text.secondary",
                display: "block",
                mb: 2,
              }}
            >
              INFO
            </Typography>
            <Stack spacing={1.25}>
              {INFO_LINKS.map((label) => (
                <Typography
                  key={label}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    cursor: "pointer",
                    transition: "color 0.15s",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Coupons reminder */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "text.secondary",
                display: "block",
                mb: 2,
              }}
            >
              ACTIVE COUPONS
            </Typography>
            <Stack spacing={1}>
              {[
                { code: "FLAT10", desc: "Flat ₹10 off" },
                { code: "SAVE50", desc: "Save ₹50" },
                { code: "FIRST20", desc: "₹20 off your first order" },
              ].map(({ code, desc }) => (
                <Box key={code} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      border: "1px dashed",
                      borderColor: "divider",
                      px: 1,
                      py: 0.25,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} KART. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Built with React + MUI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}