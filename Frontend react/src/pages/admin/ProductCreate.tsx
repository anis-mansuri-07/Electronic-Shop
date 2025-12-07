import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productAdminService from "../../services/productAdminService";
import categoryAdminService from "../../services/categoryAdminService";
import type { CategoryResponse } from "../../types/category";
import type { ProductCreateRequest } from "../../types/product";
import { MdClose } from "react-icons/md";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mrpPrice: "",
    sellingPrice: "",
    quantity: "",
    color: "",
    brand: "",
    category: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryAdminService.getAll();
      setCategories(data);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Failed to load categories",
        type: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setToast({
        open: true,
        msg: "Title and description are required",
        type: "error",
      });
      return;
    }

    if (!formData.category || formData.category === "") {
      setToast({
        open: true,
        msg: "Please select a category",
        type: "error",
      });
      return;
    }

    if (files.length === 0) {
      setToast({
        open: true,
        msg: "Please upload at least one image",
        type: "error",
      });
      return;
    }

    // Parse and validate prices
    const mrp = Number(formData.mrpPrice);
    const selling = Number(formData.sellingPrice);

    if (isNaN(mrp) || mrp <= 0) {
      setToast({
        open: true,
        msg: "Please enter a valid MRP price (must be greater than 0)",
        type: "error",
      });
      return;
    }

    if (isNaN(selling) || selling < 0) {
      setToast({
        open: true,
        msg: "Please enter a valid selling price (must be 0 or greater)",
        type: "error",
      });
      return;
    }

    if (selling >= mrp) {
      setToast({
        open: true,
        msg: "Selling price must be less than MRP price",
        type: "error",
      });
      return;
    }

    // Parse and validate quantity
    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      setToast({
        open: true,
        msg: "Please enter a valid quantity (must be a whole number 0 or greater)",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);
      // Convert prices and quantity to numbers for API
      const productData: ProductCreateRequest = {
        ...formData,
        mrpPrice: mrp,
        sellingPrice: selling,
        quantity: qty,
      };
      const result = await productAdminService.create(productData, files);
      console.log("✅ Product created:", result);
      setToast({
        open: true,
        msg: "Product created successfully",
        type: "success",
      });
      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Failed to create product",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Create Product
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <TextField
                size="small"
                label="Product Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                size="small"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
              />

              <FormControl size="small" fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  label="Category"
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select the category for this product
                </FormHelperText>
              </FormControl>

              <Box display="flex" gap={2}>
                <TextField
                  size="small"
                  label="MRP Price"
                  name="mrpPrice"
                  value={formData.mrpPrice || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  helperText="Enter the maximum retail price"
                />
                <TextField
                  size="small"
                  label="Selling Price"
                  name="sellingPrice"
                  value={formData.sellingPrice || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  helperText="Must be less than MRP"
                  error={
                    Number(formData.sellingPrice) > 0 &&
                    Number(formData.sellingPrice) >= Number(formData.mrpPrice)
                  }
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  size="small"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  helperText="Enter stock quantity"
                />
                <TextField
                  size="small"
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Box>

              <TextField
                size="small"
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                fullWidth
                required
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ textTransform: "none" }}
                >
                  Upload Images (Multiple)
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  You can select multiple images
                </Typography>
              </Box>

              {previews.length > 0 && (
                <ImageList cols={4} gap={8}>
                  {previews.map((preview, idx) => (
                    <ImageListItem key={idx}>
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        style={{
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            size="small"
                            onClick={() => removeImage(idx)}
                            sx={{
                              color: "white",
                              bgcolor: "rgba(0,0,0,0.5)",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            }}
                          >
                            <MdClose />
                          </IconButton>
                        }
                        sx={{ background: "transparent" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ mt: 1 }}
              >
                {saving ? "Creating..." : "Create Product"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminProductCreate;
