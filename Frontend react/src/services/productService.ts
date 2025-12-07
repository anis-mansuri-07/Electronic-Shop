import api from "./api";
import type {
  Product,
  ProductSearchParams,
  ProductPage,
} from "../types/product";

export const productService = {
  // Get all products with filters and pagination
  getAllProducts: async (
    params?: ProductSearchParams
  ): Promise<ProductPage> => {
    const response = await api.get<ProductPage>("/products", { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/search", {
      params: { query },
    });
    return response.data;
  },

  // Get all products without pagination
  getAllProductsList: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/getAll");
    return response.data;
  },
};
