export enum OrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface AdminOrderUser {
  id?: number;
  fullName?: string;
  email?: string;
}

export interface AdminOrderItem {
  id?: number;
  productName?: string;
  quantity?: number;
  sellingPrice?: number;
}

export interface AdminOrder {
  id: number;
  orderStatus: OrderStatus | string;
  totalSellingPrice?: number;
  totalItem?: number;
  orderDate?: string;
  deliveredDate?: string | null;
  user?: AdminOrderUser;
  items?: AdminOrderItem[];
  userEmail?: string; // some endpoints may return this directly
}

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
