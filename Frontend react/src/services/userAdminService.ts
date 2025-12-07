import api from "./api";
import type { UserSummary, ApiResponse } from "../types/user";

const userAdminService = {
  // GET /api/admin/users
  getAll: async (): Promise<UserSummary[]> => {
    const res = await api.get<UserSummary[]>("/admin/users");
    return res.data;
  },

  // DELETE /api/admin/users/{userId}
  remove: async (userId: number): Promise<ApiResponse> => {
    const res = await api.delete<ApiResponse>(`/admin/users/${userId}`);
    return res.data;
  },
};

export default userAdminService;
