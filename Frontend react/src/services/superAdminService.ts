import api from "./api";
import type {
  AdminRequest,
  AdminResponse,
  AdminUpdateRequest,
} from "../types/admin";

const superAdminService = {
  // Create new admin
  createAdmin: async (data: AdminRequest): Promise<AdminResponse> => {
    const response = await api.post("/super-admin/admins", data);
    return response.data;
  },

  // Get all admins
  getAllAdmins: async (): Promise<AdminResponse[]> => {
    const response = await api.get("/super-admin/admins");
    return response.data;
  },

  // Get admin by ID
  getAdminById: async (id: number): Promise<AdminResponse> => {
    const response = await api.get(`/super-admin/admins/${id}`);
    return response.data;
  },

  // Update admin
  updateAdmin: async (
    id: number,
    data: AdminUpdateRequest
  ): Promise<AdminResponse> => {
    const response = await api.put(`/super-admin/admins/${id}`, data);
    return response.data;
  },

  // Delete admin
  deleteAdmin: async (id: number): Promise<string> => {
    const response = await api.delete(`/super-admin/admins/${id}`);
    return response.data;
  },
};

export default superAdminService;
