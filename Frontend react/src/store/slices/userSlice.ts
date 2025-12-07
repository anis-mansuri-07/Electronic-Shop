import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";
import type {
  UserProfile,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "../../types/user";

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  passwordChanging: boolean;
  passwordChangeMessage: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  passwordChanging: false,
  passwordChangeMessage: null,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changePassword",
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const res = await userService.changePassword(data);
      return res.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
      state.passwordChangeMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change password
      .addCase(changeUserPassword.pending, (state) => {
        state.passwordChanging = true;
        state.error = null;
        state.passwordChangeMessage = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.passwordChanging = false;
        state.passwordChangeMessage = action.payload as string;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.passwordChanging = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
