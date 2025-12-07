import api from "./api";
import type { CategoryResponse } from "../types/category";

const categoryService = {
  getAll: async (): Promise<CategoryResponse[]> => {
    const res = await api.get<CategoryResponse[]>("/products/categories");
    return res.data;
  },
};

export default categoryService;
