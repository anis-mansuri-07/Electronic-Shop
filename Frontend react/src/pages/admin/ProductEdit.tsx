import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import productAdminService from "../../services/productAdminService";
import categoryAdminService from "../../services/categoryAdminService";
import type { CategoryResponse } from "../../types/category";
import type { ProductCreateRequest } from "../../types/product";
import { MdClose } from "react-icons/md";
import { buildImageUrl } from "../../utils/image";

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const product = await productAdminService.getById(productId);
      setFormData({
        title: product.title,
        description: product.description,
        mrpPrice: String(product.mrpPrice),
        sellingPrice: String(product.sellingPrice),
        quantity: String(product.quantity),
        color: product.color,
        brand: product.brand,
        category: product.category.name,
      });
      setExistingImages(product.images || []);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Failed to load product",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const removeNewImage = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
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

    // Check if there are any images (existing or new)
    if (existingImages.length === 0 && files.length === 0) {
      setToast({
        open: true,
        msg: "Please keep at least one image or upload new ones",
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

      // Note: Backend should handle keeping existing images if no new images provided
      // You may need to update backend to accept existing images list
      const result = await productAdminService.update(
        Number(id),
        productData,
        files.length > 0 ? files : undefined
      );
      console.log("✅ Product updated:", result);
      setToast({
        open: true,
        msg: "Product updated successfully",
        type: "success",
      });
      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Failed to update product",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading product...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Edit Product
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                size="small"
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.categoryName}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </TextField>

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

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Existing Images
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {existingImages.map((img, idx) => (
                      <Box
                        key={idx}
                        position="relative"
                        width={100}
                        height={100}
                        border="1px solid #ddd"
                        borderRadius={1}
                      >
                        <img
                          src={buildImageUrl(img)}
                          alt={`existing-${idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => removeExistingImage(idx)}
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            minWidth: 24,
                            width: 24,
                            height: 24,
                            p: 0,
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": { bgcolor: "error.dark" },
                          }}
                        >
                          <MdClose size={16} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* New Image Upload */}
              <Box>
                <Button variant="outlined" component="label">
                  Add New Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {previews.length > 0 && (
                  <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                    {previews.map((preview, idx) => (
                      <Box
                        key={idx}
                        position="relative"
                        width={100}
                        height={100}
                        border="1px solid #ddd"
                        borderRadius={1}
                      >
                        <img
                          src={preview}
                          alt={`preview-${idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => removeNewImage(idx)}
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            minWidth: 24,
                            width: 24,
                            height: 24,
                            p: 0,
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": { bgcolor: "error.dark" },
                          }}
                        >
                          <MdClose size={16} />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box display="flex" gap={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  fullWidth
                >
                  {saving ? "Updating..." : "Update Product"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/products")}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {toast.open && (
          <Alert
            severity={toast.type}
            onClose={() => setToast({ ...toast, open: false })}
            sx={{ mt: 2 }}
          >
            {toast.msg}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default AdminProductEdit;
