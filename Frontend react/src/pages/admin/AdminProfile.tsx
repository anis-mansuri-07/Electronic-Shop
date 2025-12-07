import { useEffect, useState, Fragment } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Stack,
  Snackbar,
  Tabs,
  Tab,
  AlertTitle,
} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import adminProfileService from "../../services/adminProfileService";
import type { AdminResponse } from "../../types/user";

const AdminProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<AdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    console.log("🔍 loadProfile called, user:", user);

    try {
      setLoading(true);
      console.log("🌐 Fetching admin profile (using authenticated context)");
      const data = await adminProfileService.getProfile();
      console.log("✅ Admin profile loaded:", data);
      setProfile(data);
    } catch (err: any) {
      console.error("❌ Failed to load admin profile:", err);
      console.error("Response:", err?.response);
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password matches backend regex
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setToast({
        open: true,
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, special character (!@#$%^&*), and no spaces",
        severity: "error",
      });
      return;
    }

    try {
      setPasswordChanging(true);
      await adminProfileService.changePassword({
        oldPassword: oldPassword.trim(),
        newPassword,
      });
      setToast({
        open: true,
        message: "Password changed successfully",
        severity: "success",
      });
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Failed to change password",
        severity: "error",
      });
    } finally {
      setPasswordChanging(false);
    }
  };

  const passwordStrengthHint = (
    <Typography variant="caption" color="text.secondary">
      Must be 8+ chars, include upper, lower, number & special symbol
      (!@#$%^&*), no spaces.
    </Typography>
  );

  return (
    <Fragment>
      <AdminNavbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your admin account information and security.
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            value="profile"
            label="Profile Details"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            value="password"
            label="Change Password"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {tab === "profile" && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : profile ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6" fontWeight={600}>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <TextField
                  label="Admin Name"
                  value={profile.adminName}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Email"
                  value={profile.email}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Role"
                  value={
                    profile.role === "ROLE_SUPER_ADMIN"
                      ? "Super Admin"
                      : "Admin"
                  }
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  Profile information is read-only. Contact Super Admin to
                  update details.
                </Alert>
              </Box>
            ) : (
              <Typography color="text.secondary">No profile data</Typography>
            )}
          </Paper>
        )}

        {tab === "password" && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              component="form"
              onSubmit={handlePasswordChange}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <TextField
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                fullWidth
                size="small"
                required
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                size="small"
                required
                helperText={passwordStrengthHint}
              />
              <Stack direction="row" gap={2} alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={passwordChanging || !oldPassword || !newPassword}
                  sx={{ textTransform: "none" }}
                >
                  {passwordChanging ? "Updating..." : "Update Password"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default AdminProfile;
