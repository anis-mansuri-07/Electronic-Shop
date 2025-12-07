import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdFilterList,
  MdInventory,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import productAdminService from "../../services/productAdminService";
import UpdateStockDialog from "../../components/admin/UpdateStockDialog";
import categoryAdminService from "../../services/categoryAdminService";
import type { Product } from "../../types/product";
import type { CategoryResponse } from "../../types/category";
import { buildFirstImage } from "../../utils/image";

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [confirm, setConfirm] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [updateStock, setUpdateStock] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryAdminService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;

      const data = await productAdminService.getAll(params);
      console.log("📦 Products loaded:", data);

      // Filter by search locally
      let filtered = data.content || [];
      if (filters.search) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProducts(filtered);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "Failed to load products",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm.id) return;
    try {
      await productAdminService.remove(confirm.id);
      setToast({
        open: true,
        msg: "Product deleted successfully",
        type: "success",
      });
      setConfirm({ open: false, id: null });
      loadProducts();
    } catch (e: any) {
      const errorMessage = e?.response?.data?.includes("foreign key constraint")
        ? "Cannot delete product. It's added to user wishlists or carts. Please remove it from there first."
        : e?.response?.data?.message || e?.response?.data || "Delete failed";

      setToast({
        open: true,
        msg: errorMessage,
        type: "error",
      });
      setConfirm({ open: false, id: null });
    }
  };

  const handleFilterChange = () => {
    loadProducts();
  };

  const clearFilters = () => {
    setFilters({ category: "", brand: "", search: "" });
    setTimeout(() => loadProducts(), 100);
  };

  // Extract unique brands from products
  const uniqueBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  );

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            Manage Products
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<MdFilterList />}
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button
              startIcon={<MdAdd />}
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() => navigate("/admin/products/create")}
            >
              New Product
            </Button>
          </Stack>
        </Stack>

        {/* Filters Section */}
        {showFilters && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  size="small"
                  label="Search by Title"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.categoryName}>
                        {cat.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={filters.brand}
                    onChange={(e) =>
                      setFilters({ ...filters, brand: e.target.value })
                    }
                    label="Brand"
                  >
                    <MenuItem value="">All Brands</MenuItem>
                    {uniqueBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleFilterChange}
                    fullWidth
                  >
                    Apply
                  </Button>
                  <Button variant="outlined" onClick={clearFilters} fullWidth>
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No products found. Create your first product!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <Paper sx={{ p: 1.5, borderRadius: 2, height: "100%" }}>
                  <Box
                    component="img"
                    src={buildFirstImage(product.images)}
                    alt={product.title}
                    sx={{
                      width: "100%",
                      height: 120,
                      objectFit: "contain",
                      bgcolor: "#f5f5f5",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Typography fontWeight={700} fontSize={14} noWrap>
                    {product.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 0.5,
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    {product.category && (
                      <Chip
                        label={product.category.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {product.brand && (
                      <Chip
                        label={product.brand}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      label={`Stock: ${product.quantity}`}
                      size="small"
                      color={product.quantity > 0 ? "success" : "error"}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through" }}
                        color="text.secondary"
                      >
                        ₹{product.mrpPrice}
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        ₹{product.sellingPrice}
                        {product.discountPercent > 0 && (
                          <Chip
                            label={`${product.discountPercent}% OFF`}
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setUpdateStock({ open: true, product })}
                        title="Update Stock"
                      >
                        <MdInventory />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/admin/products/${product.id}/edit`)
                        }
                      >
                        <MdEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setConfirm({ open: true, id: product.id })
                        }
                      >
                        <MdDelete />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Update Stock Dialog */}
      {updateStock.product && (
        <UpdateStockDialog
          open={updateStock.open}
          onClose={() => setUpdateStock({ open: false, product: null })}
          productId={updateStock.product.id}
          productTitle={updateStock.product.title}
          currentStock={updateStock.product.quantity}
          onSuccess={() => {
            setToast({
              open: true,
              msg: "Stock updated successfully",
              type: "success",
            });
            loadProducts();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, id: null })}>
            Cancel
          </Button>
          <Button onClick={onDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          severity={toast.type}
          variant="filled"
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductsList;
