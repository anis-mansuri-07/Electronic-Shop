export interface AddressRequest {
  locality: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

// Address returned with an order (includes id)
export interface OrderAddress {
  id: number;
  locality: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
}

export type PaymentMethod = "RAZORPAY" | "STRIPE";

export interface PaymentLinkResponse {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  message: string;
  paymentUrl?: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  sellingPrice: number;
  totalPrice: number;
}

export interface OrderResponse {
  id: number;
  userEmail: string;
  totalSellingPrice: number;
  totalMrpPrice: number | null;
  discount: number;
  totalItem: number;
  orderStatus: string;
  orderDate: string;
  deliveredDate: string | null;
  items: OrderItemResponse[];
  address?: OrderAddress; // legacy name
  shippingAddress?: OrderAddress; // current backend field name
}
