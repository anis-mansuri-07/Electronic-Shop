import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdLock,
  MdHome,
} from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import AuthContainer from "../../components/auth/AuthContainer";
import { login, clearError } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { LoginRequest } from "../../types/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ROLE_USER") {
        navigate("/");
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, location.state]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      const role = result.payload.role;
      if (role === "ROLE_USER") {
        navigate("/");
      } else {
        navigate("/admin/dashboard");
      }
    }
  };

  return (
    <AuthContainer
      title="Welcome Back!"
      subtitle="Sign in to access your account and continue shopping"
    >
      <Box className="mb-4 flex justify-between items-center">
        <Button
          variant="text"
          size="small"
          onClick={() => navigate("/")}
          startIcon={<MdHome />}
          sx={{
            color: "#667eea",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { backgroundColor: "#f3f4f6" },
            borderRadius: "10px",
          }}
        >
          Back to Home
        </Button>
        {/* <Typography variant="body2" className="text-gray-500">
          New here?{" "}
          <Link
            to="/register"
            className="font-bold hover:underline"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create an account
          </Link>
        </Typography> */}
      </Box>
      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            className="rounded-xl shadow-soft animate-slide-down"
            sx={{
              backgroundColor: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
              "& .MuiAlert-icon": {
                color: "#22c55e",
              },
            }}
          >
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            className="rounded-xl shadow-soft animate-slide-down"
            sx={{
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              "& .MuiAlert-icon": {
                color: "#ef4444",
              },
            }}
          >
            {error}
          </Alert>
        )}
        <div className="space-y-2">
          <Typography
            variant="body2"
            className="text-gray-700 font-semibold text-sm ml-1"
          >
            Email Address
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            disabled={isLoading}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail className="text-gray-400 text-xl" />
                </InputAdornment>
              ),
            }}
            className="custom-input"
          />
        </div>
        <div className="space-y-2">
          <Typography
            variant="body2"
            className="text-gray-700 font-semibold text-sm ml-1"
          >
            Password
          </Typography>
          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            disabled={isLoading}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className="text-gray-400 text-xl" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    disabled={isLoading}
                    sx={{
                      color: "#6b7280",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                        color: "#667eea",
                      },
                    }}
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-xl" />
                    ) : (
                      <MdVisibility className="text-xl" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="custom-input"
          />
        </div>
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold hover:underline transition-all"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? null : <FaSignInAlt size={18} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            py: 1.8,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
              boxShadow: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isLoading ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} sx={{ color: "white" }} />
              <span>Signing in...</span>
            </Box>
          ) : (
            "Sign In"
          )}
        </Button>
        <Divider className="my-6">
          <Typography
            variant="body2"
            className="text-gray-500 px-3 text-sm font-medium"
          >
            OR
          </Typography>
        </Divider>
        <div className="text-center">
          <Typography variant="body2" className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold hover:underline transition-all"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Account
            </Link>
          </Typography>
        </div>
      </form>
    </AuthContainer>
  );
};

export default Login;
