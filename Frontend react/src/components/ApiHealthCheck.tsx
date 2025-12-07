import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { MdCheckCircle, MdError, MdRefresh } from "react-icons/md";
import api from "../services/api";

const ApiHealthCheck = () => {
  const [status, setStatus] = useState<"checking" | "success" | "error">(
    "checking"
  );
  const [message, setMessage] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  const checkHealth = async () => {
    setStatus("checking");
    setApiUrl(import.meta.env.VITE_API_URL || "http://localhost:8080/api");

    try {
      // Try to fetch products as a health check
      const response = await api.get("/products/getAll");
      setStatus("success");
      setMessage(
        `Backend is reachable! Found ${response.data.length || 0} products.`
      );
    } catch (error: any) {
      setStatus("error");
      if (error.code === "ERR_NETWORK") {
        setMessage("Cannot connect to backend. Is the server running?");
      } else if (error.code === "ECONNABORTED") {
        setMessage("Request timeout. Backend is not responding.");
      } else {
        setMessage(error.message || "Failed to connect to backend");
      }
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <Box className="fixed bottom-4 right-4 z-50">
      <Box className="bg-white rounded-2xl shadow-large p-4 border border-gray-200 max-w-sm">
        <Box className="flex items-start gap-3">
          <Box className="flex-shrink-0 mt-1">
            {status === "checking" && <CircularProgress size={24} />}
            {status === "success" && (
              <MdCheckCircle className="text-green-500 text-2xl" />
            )}
            {status === "error" && (
              <MdError className="text-red-500 text-2xl" />
            )}
          </Box>

          <Box className="flex-1">
            <Typography variant="subtitle2" className="font-bold mb-1">
              API Status
            </Typography>
            <Typography variant="caption" className="text-gray-600 block mb-2">
              {apiUrl}
            </Typography>
            <Typography variant="body2" className="text-gray-700 mb-3">
              {status === "checking" ? "Checking connection..." : message}
            </Typography>

            {status === "error" && (
              <Alert severity="error" className="mb-3 text-xs">
                <strong>Troubleshooting:</strong>
                <ul className="mt-1 ml-4 list-disc text-xs">
                  <li>Ensure backend is running on port 8080</li>
                  <li>Check CORS configuration in backend</li>
                  <li>Restart dev server after .env changes</li>
                </ul>
              </Alert>
            )}

            <Button
              size="small"
              startIcon={<MdRefresh />}
              onClick={checkHealth}
              disabled={status === "checking"}
              className="custom-outlined-btn"
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                py: 0.5,
                px: 2,
              }}
            >
              Retry
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ApiHealthCheck;
