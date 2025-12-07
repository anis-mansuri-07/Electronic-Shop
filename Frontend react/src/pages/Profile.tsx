import { useEffect, useState, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  clearUserErrors,
} from "../store/slices/userSlice";
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
import Navbar from "../components/Navbar";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, error, passwordChanging, passwordChangeMessage } =
    useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [showPasswordMsg, setShowPasswordMsg] = useState(false);
  const [showProfileMsg, setShowProfileMsg] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [tab, setTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
  }, [profile]);

  useEffect(() => {
    if (passwordChangeMessage) {
      setShowPasswordMsg(true);
    }
  }, [passwordChangeMessage]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const trimmedName = fullName.trim();
    const originalName = profile.fullName || "";
    const originalPhone = profile.phoneNumber || "";
    const unchanged =
      trimmedName === (originalName || "") &&
      phoneNumber === (originalPhone || "");
    if (unchanged) {
      setProfileMessage("No changes to update");
      setShowProfileMsg(true);
      return;
    }
    setSavingProfile(true);
    try {
      await dispatch(
        updateUserProfile({ fullName: trimmedName, phoneNumber })
      ).unwrap();
      setProfileMessage("Profile updated successfully");
      setShowProfileMsg(true);
    } catch (_) {
      // error handled by slice
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password matches backend regex
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setProfileMessage(
        "Password must be at least 8 characters, include uppercase, lowercase, number, special character (!@#$%^&*), and no spaces"
      );
      setShowProfileMsg(true);
      return;
    }

    try {
      await dispatch(
        changeUserPassword({ oldPassword: oldPassword.trim(), newPassword })
      ).unwrap();
      setOldPassword("");
      setNewPassword("");
    } catch (_) {
      /* error handled */
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
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage your personal information and account security.
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
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => dispatch(clearUserErrors())}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {tab === "profile" && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              component="form"
              onSubmit={handleProfileSubmit}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Profile Information
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Email"
                value={profile?.email || ""}
                fullWidth
                size="small"
                disabled
              />
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                size="small"
                placeholder="10 digit number"
                inputProps={{ maxLength: 10 }}
              />
              <Stack direction="row" gap={2} alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={savingProfile || isLoading}
                  sx={{ textTransform: "none" }}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Box>
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

        {isLoading && !profile && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={28} />
          </Box>
        )}
      </Container>
      {/* Snackbars */}
      <Snackbar
        open={showProfileMsg}
        autoHideDuration={3500}
        onClose={() => setShowProfileMsg(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={
            profileMessage.includes("successfully") ? "success" : "info"
          }
          onClose={() => setShowProfileMsg(false)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {profileMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showPasswordMsg}
        autoHideDuration={4000}
        onClose={() => setShowPasswordMsg(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={passwordChangeMessage ? "success" : "info"}
          onClose={() => setShowPasswordMsg(false)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {passwordChangeMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default Profile;
