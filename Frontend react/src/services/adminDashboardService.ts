import api from "./api";
import type { DashboardStatsResponse, OrderStatusCounts } from "../types/admin";

const adminDashboardService = {
  getStats: async (): Promise<DashboardStatsResponse> => {
    const res = await api.get<DashboardStatsResponse>("/admin/dashboard/stats");
    return res.data;
  },
  getOrderStatus: async (): Promise<OrderStatusCounts> => {
    const res = await api.get<OrderStatusCounts>(
      "/admin/dashboard/order-status"
    );
    return res.data;
  },
};

export default adminDashboardService;
