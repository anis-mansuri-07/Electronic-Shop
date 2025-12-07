import { useEffect } from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import { useAppSelector } from "../store/hooks";

const DebugAuth = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("=== DEBUG AUTH ===");
    console.log("User from Redux:", user);
    console.log("Is Authenticated:", isAuthenticated);
    console.log(
      "LocalStorage token:",
      localStorage.getItem("token")?.substring(0, 30)
    );
    console.log("LocalStorage role:", localStorage.getItem("role"));
    console.log("LocalStorage email:", localStorage.getItem("email"));
    console.log("LocalStorage fullName:", localStorage.getItem("fullName"));
    console.log("User role type:", typeof user?.role);
    console.log("User role value:", user?.role);
    console.log("Is SUPER_ADMIN?:", user?.role === "ROLE_SUPER_ADMIN");
  }, [user, isAuthenticated]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Authentication Debug Info
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            <strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Full Name:</strong> {user?.fullName || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {user?.role || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Role Type:</strong> {typeof user?.role}
          </Typography>
          <Typography variant="body1">
            <strong>Is SUPER_ADMIN:</strong>{" "}
            {user?.role === "ROLE_SUPER_ADMIN" ? "YES" : "NO"}
          </Typography>
          <Typography variant="body1">
            <strong>Token (first 30 chars):</strong>{" "}
            {localStorage.getItem("token")?.substring(0, 30) || "N/A"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default DebugAuth;
