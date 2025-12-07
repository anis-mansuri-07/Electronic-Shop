import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import categoryAdminService from "../../services/categoryAdminService";
import { buildImageUrl } from "../../utils/image";

const CategoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await categoryAdminService.getById(categoryId);
        setName(data.categoryName);
        setCurrentImage(data.imageUrl || null);
      } catch (e: any) {
        setToast({
          open: true,
          msg: e?.response?.data?.message || "Failed to load category",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ open: true, msg: "Category name is required", type: "error" });
      return;
    }
    try {
      setSaving(true);
      await categoryAdminService.update(
        categoryId,
        { categoryName: name.trim() },
        file || undefined
      );
      setToast({ open: true, msg: "Category updated", type: "success" });
      setTimeout(() => navigate("/admin/categories"), 800);
    } catch (err: any) {
      setToast({
        open: true,
        msg: err?.response?.data?.message || "Update failed",
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
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Edit Category
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
                  Upload New Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </Button>
                {(preview || currentImage) && (
                  <Avatar
                    variant="rounded"
                    src={preview || buildImageUrl(currentImage)}
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
                {saving ? "Saving..." : "Save Changes"}
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

export default CategoryEdit;
