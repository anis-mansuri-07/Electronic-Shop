import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdVerifiedUser,
  MdHome,
} from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import AuthContainer from "../../components/auth/AuthContainer";
import {
  sendRegisterOtp,
  register,
  clearError,
} from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RegisterRequest } from "../../types/auth";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [activeStep, setActiveStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
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
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, uppercase, lowercase, number, special character, no spaces
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
    dispatch(clearError());
  };

  const validateStep1 = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, special character (!@#$%^&*), and no spaces";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    const result = await dispatch(sendRegisterOtp({ email: formData.email }));
    if (sendRegisterOtp.fulfilled.match(result)) {
      setOtpSent(true);
      setActiveStep(1);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      setValidationErrors({ otp: "OTP is required" });
      return;
    }

    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    }
  };

  const steps = ["Account Information", "Verify OTP"];

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join us and start shopping for electronics"
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold hover:underline"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sign in
          </Link>
        </Typography> */}
      </Box>
      <Stepper
        activeStep={activeStep}
        className="mb-8"
        sx={{
          "& .MuiStepLabel-root .Mui-completed": {
            color: "#8b5cf6",
          },
          "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
            color: "#8b5cf6",
          },
          "& .MuiStepLabel-root .Mui-active": {
            color: "#8b5cf6",
          },
          "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
            color: "#8b5cf6",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
        <Box component="form" className="space-y-5">
          {error && (
            <Alert
              severity="error"
              className="mb-4 rounded-xl shadow-md"
              sx={{
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                "& .MuiAlert-icon": {
                  color: "#ef4444",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="Enter your email"
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Full Name
            </Typography>
            <TextField
              fullWidth
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPerson className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              name="phoneNumber"
              placeholder="Enter 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!validationErrors.phoneNumber}
              helperText={validationErrors.phoneNumber}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPhone className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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
                      sx={{
                        color: "#64748b",
                        "&:hover": {
                          backgroundColor: "#f1f5f9",
                          color: "#8b5cf6",
                        },
                      }}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                      sx={{
                        color: "#64748b",
                        "&:hover": {
                          backgroundColor: "#f1f5f9",
                          color: "#8b5cf6",
                        },
                      }}
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff />
                      ) : (
                        <MdVisibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Button
            type="button"
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSendOtp}
            disabled={isLoading}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              padding: "14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                background: "#cbd5e1",
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>

          <Divider
            sx={{
              my: 4,
              "&::before, &::after": {
                borderColor: "#e2e8f0",
              },
            }}
          >
            <Typography variant="body2" className="text-gray-500 px-2">
              OR
            </Typography>
          </Divider>

          <Box className="text-center">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleRegister} className="space-y-5">
          {error && (
            <Alert
              severity="error"
              className="mb-4 rounded-xl shadow-md"
              sx={{
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                "& .MuiAlert-icon": {
                  color: "#ef4444",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {otpSent && (
            <Alert
              severity="success"
              className="mb-4 rounded-xl shadow-md"
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#166534",
                "& .MuiAlert-icon": {
                  color: "#22c55e",
                },
              }}
            >
              OTP has been sent to {formData.email}. Please check your email.
            </Alert>
          )}

          <Box className="space-y-1">
            <Typography
              variant="body2"
              className="text-gray-700 font-medium ml-1"
            >
              Enter OTP
            </Typography>
            <TextField
              fullWidth
              name="otp"
              placeholder="Enter the 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              error={!!validationErrors.otp}
              helperText={
                validationErrors.otp ||
                "Enter the 6-digit OTP sent to your email"
              }
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdVerifiedUser className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                  },
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </Box>

          <Box className="flex gap-4">
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                setActiveStep(0);
                setOtpSent(false);
                setFormData((prev) => ({ ...prev, otp: "" }));
              }}
              disabled={isLoading}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "12px",
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#8b5cf6",
                  backgroundColor: "#faf5ff",
                  color: "#8b5cf6",
                },
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              startIcon={<FaUserPlus />}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  background: "#cbd5e1",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Box>

          <Box className="text-center">
            <Button
              type="button"
              variant="text"
              size="small"
              onClick={handleSendOtp}
              disabled={isLoading}
              sx={{
                color: "#8b5cf6",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#faf5ff",
                },
              }}
            >
              Resend OTP
            </Button>
          </Box>
        </Box>
      )}
    </AuthContainer>
  );
};

export default Register;
