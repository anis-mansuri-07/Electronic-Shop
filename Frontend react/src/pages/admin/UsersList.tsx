import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { MdDelete, MdPeople } from "react-icons/md";
import userAdminService from "../../services/userAdminService";
import type { UserSummary } from "../../types/user";

const UsersList = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [confirm, setConfirm] = useState<{
    open: boolean;
    user: UserSummary | null;
  }>({
    open: false,
    user: null,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userAdminService.getAll();
      console.log("👥 Users loaded:", data);
      setUsers(data);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "Failed to load users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm.user) return;

    try {
      await userAdminService.remove(confirm.user.id);
      setToast({
        open: true,
        msg: "User deleted successfully",
        type: "success",
      });
      setConfirm({ open: false, user: null });
      loadUsers();
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message ||
        e?.response?.data ||
        "Failed to delete user";
      setToast({
        open: true,
        msg: errorMessage,
        type: "error",
      });
      setConfirm({ open: false, user: null });
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <MdPeople size={32} />
              <Typography variant="h5" fontWeight={700}>
                Users Management
              </Typography>
            </Box>
            <Chip
              label={`Total Users: ${users.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading users...</Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Full Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setConfirm({ open: true, user: user })}
                          title="Delete User"
                        >
                          <MdDelete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, user: null })}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user{" "}
          <strong>{confirm.user?.fullName}</strong> ({confirm.user?.email})?
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, user: null })}>
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

export default UsersList;
