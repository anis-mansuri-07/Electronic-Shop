import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import categoryAdminService from "../../services/categoryAdminService";
import type { CategoryResponse } from "../../types/category";
import { buildImageUrl } from "../../utils/image";

const CategoriesList = () => {
  const [rows, setRows] = useState<CategoryResponse[]>([]);
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
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await categoryAdminService.getAll();
      console.log("📦 Categories loaded:", data);
      console.log("🖼️ First category image URL:", data[0]?.imageUrl);
      setRows(data);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "Failed to load categories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async () => {
    if (!confirm.id) return;
    try {
      await categoryAdminService.remove(confirm.id);
      setToast({ open: true, msg: "Category deleted", type: "success" });
      setConfirm({ open: false, id: null });
      load();
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "Delete failed",
        type: "error",
      });
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight={700}>
            Categories
          </Typography>
          <Button
            startIcon={<MdAdd />}
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/admin/categories/create")}
          >
            New Category
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {rows.map((c) => (
              <Grid key={c.id} size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      variant="rounded"
                      src={buildImageUrl(c.imageUrl)}
                      sx={{ width: 64, height: 64 }}
                    >
                      {c.categoryName[0]}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={700}>{c.categoryName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Products: {c.productCount}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() =>
                          navigate(`/admin/categories/${c.id}/edit`)
                        }
                      >
                        <MdEdit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setConfirm({ open: true, id: c.id })}
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

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, id: null })}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={onDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesList;
