import api from "./api";
import type {
  Cart,
  AddItemRequest,
  CartItemResponse,
  CartItem,
} from "../types/cart";

const cartService = {
  // Get user cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>("/user/cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (request: AddItemRequest): Promise<CartItemResponse> => {
    const response = await api.post<CartItemResponse>(
      "/user/cart/add",
      request
    );
    return response.data;
  },

  // Remove cart item
  removeCartItem: async (cartItemId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/user/cart/item/${cartItemId}`
    );
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (
    cartItemId: number,
    cartItem: Partial<CartItem>
  ): Promise<CartItem> => {
    const response = await api.put<CartItem>(
      `/user/cart/item/${cartItemId}`,
      cartItem
    );
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>("/user/cart/clear");
    return response.data;
  },
};

export default cartService;
