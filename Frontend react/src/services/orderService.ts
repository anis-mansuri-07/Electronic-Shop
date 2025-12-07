import api from "./api";
import type {
  AddressRequest,
  PaymentLinkResponse,
  OrderResponse,
  OrderItemResponse,
} from "../types/order";

const orderService = {
  createOrder: async (
    address: AddressRequest,
    paymentMethod: "RAZORPAY" | "STRIPE" = "RAZORPAY"
  ): Promise<PaymentLinkResponse> => {
    const response = await api.post("/orders", address, {
      params: { paymentMethod },
    });
    return response.data;
  },
  getUserOrders: async (): Promise<OrderResponse[]> => {
    const response = await api.get("/orders/user");
    return response.data;
  },
  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  getOrderItemById: async (orderItemId: number): Promise<OrderItemResponse> => {
    const response = await api.get(`/orders/item/${orderItemId}`);
    return response.data;
  },
  cancelOrder: async (orderId: number): Promise<OrderResponse> => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderService;
