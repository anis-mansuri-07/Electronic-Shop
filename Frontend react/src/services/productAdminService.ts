import api from "./api";
import type {
  Product,
  ProductCreateRequest,
  ProductPage,
} from "../types/product";

const productAdminService = {
  // GET /api/admin/products with filters
  getAll: async (params?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    pageNumber?: number;
  }): Promise<ProductPage> => {
    const res = await api.get<ProductPage>("/admin/products", { params });
    return res.data;
  },

  // GET /api/admin/products/{id}
  getById: async (id: number): Promise<Product> => {
    const res = await api.get<Product>(`/admin/products/${id}`);
    return res.data;
  },

  // POST multipart /api/admin/products
  create: async (
    data: ProductCreateRequest,
    imageFiles: File[]
  ): Promise<Product> => {
    const form = new FormData();
    form.append("product", JSON.stringify(data));
    imageFiles.forEach((file) => {
      form.append("images", file);
    });
    const res = await api.post<Product>("/admin/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PUT multipart /api/admin/products/{id}
  update: async (
    id: number,
    data: Partial<ProductCreateRequest>,
    imageFiles?: File[]
  ): Promise<Product> => {
    const form = new FormData();
    form.append("product", JSON.stringify(data));
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        form.append("images", file);
      });
    }
    const res = await api.put<Product>(`/admin/products/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PATCH /api/admin/products/{id}/stock
  updateStock: async (id: number, newStock: number): Promise<Product> => {
    const res = await api.patch<Product>(`/admin/products/${id}/stock`, null, {
      params: { newStock },
    });
    return res.data;
  },

  // DELETE /api/admin/products/{id}
  remove: async (id: number): Promise<string> => {
    const res = await api.delete<string>(`/admin/products/${id}`);
    return res.data;
  },
};

export default productAdminService;
