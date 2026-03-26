import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Pagination,
  InputAdornment,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type{ RootState } from "../app/store";
import { setQuery } from "../store/searchSlice";
import ProductCard from "../components/ProductCard";
import { SearchIcon } from "../components/icons/Icons";

const PER_PAGE = 12;

interface ProductsPageProps {
  onToast: (msg: string, severity?: "success" | "error" | "info") => void;
}

export default function ProductsPage({ onToast }: ProductsPageProps) {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => s.products.items);
  const query = useSelector((s: RootState) => s.search.query);
  const [page, setPage] = useState(1);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const displayed = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleQueryChange = (value: string) => {
    dispatch(setQuery(value));
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 5,
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ letterSpacing: "-0.03em" }}>
            {query ? (
              <>
                Results for{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  "{query}"
                </Box>
              </>
            ) : (
              "All Products"
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {filtered.length} {filtered.length === 1 ? "product" : "products"} found
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Filter products..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: "text.secondary", display: "flex" }}>
                    <SearchIcon />
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />
          {query && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQueryChange("")}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Grid */}
      {displayed.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 14 }}>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300, mb: 1 }}>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Try a different search term or clear the filter.
          </Typography>
          <Button variant="outlined" onClick={() => handleQueryChange("")}>
            Clear filter
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {displayed.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} onToast={onToast} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 7 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            shape="rounded"
            size="medium"
          />
        </Box>
      )}
    </Container>
  );
}