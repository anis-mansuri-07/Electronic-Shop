import { Role } from "./auth";

export interface DashboardStatsResponse {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCancelledOrders: number;
  totalRefundAmount: number;
  totalCategories: number;
}

export type OrderStatusCounts = Record<string, number>;

export interface AdminRequest {
  adminName: string;
  email: string;
  password: string;
}

export interface AdminResponse {
  id: number;
  adminName: string;
  email: string;
  role: Role;
}

export interface AdminUpdateRequest {
  adminName?: string;
  email?: string;
  password?: string;
}
