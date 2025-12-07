import api from "./api";
import type { AdminOrder } from "../types/adminOrder";
import type { OrderResponse } from "../types/order";
import { OrderStatus } from "../types/adminOrder";

const adminOrderService = {
  getAll: async (): Promise<AdminOrder[]> => {
    const res = await api.get<AdminOrder[]>("/admin/orders");
    return res.data;
  },
  getByStatus: async (status: OrderStatus): Promise<AdminOrder[]> => {
    const res = await api.get<AdminOrder[]>(`/admin/orders/status/${status}`);
    return res.data;
  },
  updateStatus: async (
    orderId: number,
    status: OrderStatus
  ): Promise<AdminOrder> => {
    const res = await api.put<AdminOrder>(
      `/admin/orders/${orderId}/status`,
      null,
      {
        params: { status },
      }
    );
    return res.data;
  },
  getById: async (orderId: number): Promise<OrderResponse> => {
    const res = await api.get<OrderResponse>(`/admin/orders/${orderId}`);
    return res.data;
  },
};

export default adminOrderService;
