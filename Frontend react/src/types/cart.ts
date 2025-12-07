import type { Product } from "./product";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
  userId: number;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
  totalSellingPrice: number;
  totalItem: number;
  totalMrpPrice: number;
  discount: number;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  product: Product;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
  userId: number;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}
