import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/productsSlice";
import type{ Product, Page } from "../types";
import { BRANDS } from "../data/seedData";
import { TrashIcon } from "../components/icons/Icons";

interface AddProductPageProps {
  setPage: (p: Page) => void;
  onToast: (msg: string, severity?: "success" | "error" | "info") => void;
}

interface FormState {
  name: string;
  brand: string;
  customBrand: string;
  price: string;
  stock: string;
  description: string;
  imageUrls: string[];
  isAvailable: boolean;
}

interface FormErrors {
  name?: string;
  brand?: string;
  price?: string;
  stock?: string;
  imageUrls?: string;
  description?: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  brand: "",
  customBrand: "",
  price: "",
  stock: "",
  description: "",
  imageUrls: [""],
  isAvailable: true,
};

export default function AddProductPage({ setPage, onToast }: AddProductPageProps) {
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [useCustomBrand, setUseCustomBrand] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const wordCount = form.description.trim()
    ? form.description.trim().split(/\s+/).length
    : 0;

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Product name is required";
    const effectiveBrand = useCustomBrand ? form.customBrand.trim() : form.brand;
    if (!effectiveBrand) e.brand = "Brand is required";
    if (!form.price || parseFloat(form.price) <= 0) e.price = "Price must be greater than 0";
    if (form.stock === "" || parseInt(form.stock) < 0) e.stock = "Stock must be 0 or more";
    if (form.imageUrls.filter((u) => u.trim()).length === 0)
      e.imageUrls = "At least one image URL is required";
    if (wordCount > 70) e.description = "Description exceeds 70 words";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const product: Product = {
      id: `p_${Date.now()}`,
      name: form.name.trim(),
      brand: useCustomBrand ? form.customBrand.trim() : form.brand,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      description: form.description.trim(),
      imageUrls: form.imageUrls.filter((u) => u.trim()),
      isAvailable: form.isAvailable,
      createdAt: new Date().toISOString(),
    };
    dispatch(addProduct(product));
    onToast(`"${product.name}" added successfully`);
    setForm(EMPTY_FORM);
    setErrors({});
    setPage("products");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 7 }}>
      <Typography variant="h4" sx={{ letterSpacing: "-0.03em", mb: 0.75 }}>
        Add Product
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
        Fill in the details below to add a new product to the catalog.
      </Typography>

      <Stack spacing={3}>
        {/* Name */}
        <TextField
          label="Product Name"
          fullWidth
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Brand */}
        <FormControl fullWidth error={!!errors.brand}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={useCustomBrand ? "__custom__" : form.brand}
            label="Brand"
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setUseCustomBrand(true);
                set("brand", "");
              } else {
                setUseCustomBrand(false);
                set("brand", e.target.value as string);
              }
            }}
          >
            {BRANDS.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem value="__custom__">
              <em>+ Add custom brand</em>
            </MenuItem>
          </Select>
          {errors.brand && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.brand}
            </Typography>
          )}
        </FormControl>

        {useCustomBrand && (
          <TextField
            label="Custom Brand Name"
            fullWidth
            value={form.customBrand}
            onChange={(e) => set("customBrand", e.target.value)}
            error={!!errors.brand && !form.customBrand.trim()}
          />
        )}

        {/* Price & Stock */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Price (₹)"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Stock"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 1 }}
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              error={!!errors.stock}
              helperText={errors.stock}
            />
          </Grid>
        </Grid>

        {/* Description */}
        <Box>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.75, mb: 0.5 }}>
            <Typography
              variant="caption"
              color={wordCount > 70 ? "error" : "text.secondary"}
            >
              {wordCount} / 70 words
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((wordCount / 70) * 100, 100)}
            color={wordCount > 70 ? "error" : wordCount > 55 ? "warning" : "success"}
            sx={{ height: 2, borderRadius: 1 }}
          />
        </Box>

        {/* Image URLs */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.25 }}>
            Image URLs
          </Typography>
          <Stack spacing={1}>
            {form.imageUrls.map((url, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Image URL ${i + 1}`}
                  value={url}
                  onChange={(e) => {
                    const urls = [...form.imageUrls];
                    urls[i] = e.target.value;
                    set("imageUrls", urls);
                  }}
                />
                {form.imageUrls.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      set("imageUrls", form.imageUrls.filter((_, j) => j !== i))
                    }
                    sx={{ color: "error.main", flexShrink: 0 }}
                  >
                    <TrashIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
          {errors.imageUrls && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
              {errors.imageUrls}
            </Typography>
          )}
          <Button
            size="small"
            onClick={() => set("imageUrls", [...form.imageUrls, ""])}
            sx={{ mt: 1 }}
          >
            + Add another URL
          </Button>
        </Box>

        {/* Availability */}
        <FormControlLabel
          control={
            <Checkbox
              checked={form.isAvailable}
              onChange={(e) => set("isAvailable", e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2">Product is available for purchase</Typography>
          }
        />

        {/* Submit */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 1 }}
        >
          Add Product
        </Button>

        <Button
          size="small"
          color="inherit"
          onClick={() => setPage("products")}
          sx={{ color: "text.secondary" }}
        >
          Cancel
        </Button>
      </Stack>
    </Container>
  );
}