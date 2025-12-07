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
  Avatar,
} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryAdminService from "../../services/categoryAdminService";

const AdminCategoryCreate = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      setToast({
        open: true,
        msg: "Category name and image are required",
        type: "error",
      });
      return;
    }
    try {
      setSaving(true);
      const result = await categoryAdminService.create(
        { categoryName: name.trim() },
        file
      );
      console.log("✅ Category created:", result);
      console.log("🖼️ Image URL returned:", result.imageUrl);
      setToast({
        open: true,
        msg: "Category created successfully",
        type: "success",
      });
      setTimeout(() => navigate("/admin/categories"), 800);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Failed to create category",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <AdminNavbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Create Category
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                size="small"
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ textTransform: "none" }}
                >
                  Upload Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </Button>
                {preview && (
                  <Avatar
                    variant="rounded"
                    src={preview}
                    sx={{ width: 64, height: 64 }}
                  />
                )}
              </Stack>
              <Button
                type="submit"
                sx={{ mt: 1 }}
                variant="contained"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Category"}
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

export default AdminCategoryCreate;
