import api from "./api";
import type { ChangePasswordRequest, AdminResponse } from "../types/user";

const adminProfileService = {
  // GET /api/admin/profile (no ID needed, uses authenticated user)
  getProfile: async (): Promise<AdminResponse> => {
    console.log(
      "🔗 adminProfileService.getProfile called (using auth context)"
    );
    const url = `/admin/profile`;
    console.log("📡 API URL:", url);
    const res = await api.get<AdminResponse>(url);
    console.log("📥 API Response:", res.data);
    return res.data;
  },

  // PUT /api/admin/change-password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(
      "/admin/change-password",
      data
    );
    return res.data;
  },
};

export default adminProfileService;
