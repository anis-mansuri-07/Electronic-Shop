import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import type {
  LoginRequest,
  RegisterRequest,
  OtpRequest,
  ResetPassRequest,
  User,
  Role,
} from "../../types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: (() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");

    if (token && role && email) {
      return { id: 0, token, role, email, fullName: fullName || "" };
    }
    return null;
  })(),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

// Async thunks
export const sendRegisterOtp = createAsyncThunk(
  "auth/sendRegisterOtp",
  async (data: OtpRequest, { rejectWithValue }) => {
    try {
      return await authService.sendRegisterOtp(data.email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      console.log("🔍 Backend login response:", response);
      console.log("🔍 Full Name received:", response.fullName);

      // Store in localStorage
      localStorage.setItem("token", response.jwt);
      localStorage.setItem("role", response.role);
      localStorage.setItem("email", data.email.toLowerCase());
      localStorage.setItem("fullName", response.fullName || "");

      console.log("✅ Stored in localStorage:", {
        token: response.jwt?.substring(0, 20) + "...",
        role: response.role,
        email: data.email.toLowerCase(),
        fullName: response.fullName,
      });

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  "auth/sendForgotPasswordOtp",
  async (data: OtpRequest, { rejectWithValue }) => {
    try {
      return await authService.sendForgotPasswordOtp(data.email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPassRequest, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send Register OTP
    builder
      .addCase(sendRegisterOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendRegisterOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendRegisterOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        // Decode JWT to get user ID
        let userId = 0;
        try {
          const token = action.payload.jwt;
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const payload = JSON.parse(jsonPayload);
          userId = payload.userId || payload.sub || 0;
          console.log("🔓 Decoded JWT payload:", payload);
          console.log("👤 User ID from token:", userId);
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }

        state.user = {
          id: userId,
          token: action.payload.jwt,
          role: action.payload.role,
          email: action.meta.arg.email.toLowerCase(),
          fullName: action.payload.fullName,
        };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Send Forgot Password OTP
    builder
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
