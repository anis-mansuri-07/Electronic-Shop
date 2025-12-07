import api from "./api";
import type { CategoryResponse, CategoryRequest } from "../types/category";

const categoryAdminService = {
  // GET /api/admin/categories
  getAll: async (): Promise<CategoryResponse[]> => {
    const res = await api.get<CategoryResponse[]>("/admin/categories");
    return res.data;
  },

  // GET /api/admin/categories/{id}
  getById: async (id: number): Promise<CategoryResponse> => {
    const res = await api.get<CategoryResponse>(`/admin/categories/${id}`);
    return res.data;
  },

  // POST multipart /api/admin/categories
  create: async (
    data: CategoryRequest,
    imageFile: File
  ): Promise<CategoryResponse> => {
    const form = new FormData();
    form.append("category", JSON.stringify(data));
    form.append("image", imageFile);
    const res = await api.post<CategoryResponse>("/admin/categories", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PUT multipart /api/admin/categories/{id}
  update: async (
    id: number,
    data: Partial<CategoryRequest>,
    imageFile?: File | null
  ): Promise<CategoryResponse> => {
    const form = new FormData();
    form.append("category", JSON.stringify(data));
    if (imageFile) form.append("image", imageFile);
    const res = await api.put<CategoryResponse>(
      `/admin/categories/${id}`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  // DELETE /api/admin/categories/{id}
  remove: async (id: number): Promise<string> => {
    const res = await api.delete<string>(`/admin/categories/${id}`);
    return res.data as unknown as string;
  },
};

export default categoryAdminService;
