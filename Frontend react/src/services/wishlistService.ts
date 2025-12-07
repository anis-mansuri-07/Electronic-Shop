import api from "./api";
import type { WishlistResponse } from "../types/wishlist";

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await api.get<WishlistResponse>("/wishlist");
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await api.post<WishlistResponse>(`/wishlist/${productId}`);
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await api.delete<WishlistResponse>(
      `/wishlist/${productId}`
    );
    return response.data;
  },
};
