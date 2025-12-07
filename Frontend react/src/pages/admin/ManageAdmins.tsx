import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { MdEdit, MdDelete, MdPersonAdd } from "react-icons/md";
import AdminNavbar from "../../components/AdminNavbar";
import superAdminService from "../../services/superAdminService";
import type {
  AdminResponse,
  AdminRequest,
  AdminUpdateRequest,
} from "../../types/admin";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminResponse | null>(
    null
  );

  // Form states
  const [formData, setFormData] = useState<AdminRequest>({
    adminName: "",
    email: "",
    password: "",
  });

  const [editFormData, setEditFormData] = useState<AdminUpdateRequest>({
    adminName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await superAdminService.getAllAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpen = () => {
    setFormData({ adminName: "", email: "", password: "" });
    setOpenCreate(true);
  };

  const handleCreateClose = () => {
    setOpenCreate(false);
    setFormData({ adminName: "", email: "", password: "" });
  };

  const handleCreateSubmit = async () => {
    try {
      setError(null);
      await superAdminService.createAdmin(formData);
      setSuccess("Admin created successfully");
      handleCreateClose();
      loadAdmins();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create admin");
    }
  };

  const handleEditOpen = (admin: AdminResponse) => {
    setSelectedAdmin(admin);
    setEditFormData({
      adminName: admin.adminName,
      email: admin.email,
      password: "",
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedAdmin(null);
    setEditFormData({ adminName: "", email: "", password: "" });
  };

  const handleEditSubmit = async () => {
    if (!selectedAdmin) return;
    try {
      setError(null);
      // Only send fields that have values
      const updateData: AdminUpdateRequest = {};
      if (editFormData.adminName) updateData.adminName = editFormData.adminName;
      if (editFormData.email) updateData.email = editFormData.email;
      if (editFormData.password) updateData.password = editFormData.password;

      await superAdminService.updateAdmin(selectedAdmin.id, updateData);
      setSuccess("Admin updated successfully");
      handleEditClose();
      loadAdmins();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update admin");
    }
  };

  const handleDeleteOpen = (admin: AdminResponse) => {
    setSelectedAdmin(admin);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectedAdmin(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    try {
      setError(null);
      await superAdminService.deleteAdmin(selectedAdmin.id);
      setSuccess("Admin deleted successfully");
      handleDeleteClose();
      loadAdmins();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ROLE_SUPER_ADMIN":
        return "error";
      case "ROLE_ADMIN":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    return role.replace("ROLE_", "").replace("_", " ");
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <Container maxWidth="xl" className="py-8">
        {/* Header */}
        <Box className="mb-6 flex justify-between items-center">
          <Box>
            <Typography
              variant="h4"
              className="font-bold mb-2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Manage Admins
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create, update, and manage admin accounts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<MdPersonAdd />}
            onClick={handleCreateOpen}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: "12px",
            }}
          >
            Add Admin
          </Button>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            className="mb-4"
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess(null)}
            className="mb-4"
          >
            {success}
          </Alert>
        )}

        {/* Table */}
        <Paper elevation={0} sx={{ borderRadius: "16px", overflow: "hidden" }}>
          {loading ? (
            <Box className="flex justify-center items-center p-12">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Email
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Role
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={700}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No admins found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow
                        key={admin.id}
                        hover
                        sx={{ "&:last-child td": { border: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2">{admin.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {admin.adminName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {admin.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleLabel(admin.role)}
                            color={getRoleColor(admin.role)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEditOpen(admin)}
                              sx={{
                                color: "#667eea",
                                "&:hover": { backgroundColor: "#667eea20" },
                              }}
                            >
                              <MdEdit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteOpen(admin)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": { backgroundColor: "#ef444420" },
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Create Dialog */}
        <Dialog
          open={openCreate}
          onClose={handleCreateClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Create New Admin</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Admin Name"
                fullWidth
                value={formData.adminName}
                onChange={(e) =>
                  setFormData({ ...formData, adminName: e.target.value })
                }
                required
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCreateClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateSubmit}
              disabled={
                !formData.adminName || !formData.email || !formData.password
              }
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
              }}
            >
              Create Admin
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={openEdit}
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Admin</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Admin Name"
                fullWidth
                value={editFormData.adminName}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    adminName: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
              <TextField
                label="New Password (leave blank to keep current)"
                type="password"
                fullWidth
                value={editFormData.password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, password: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleEditClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEditSubmit}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
              }}
            >
              Update Admin
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDelete}
          onClose={handleDeleteClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Delete Admin</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete{" "}
              <strong>{selectedAdmin?.adminName}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ManageAdmins;
