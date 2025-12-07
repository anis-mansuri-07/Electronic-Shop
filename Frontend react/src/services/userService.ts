import api from "./api";
import type {
  UserProfile,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "../types/user";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>("/user/profile");
    return res.data;
  },
  updateProfile: async (data: UpdateUserRequest): Promise<UserProfile> => {
    const res = await api.put<UserProfile>("/user/profile", data);
    return res.data;
  },
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(
      "/user/change-password",
      data
    );
    return res.data;
  },
};
