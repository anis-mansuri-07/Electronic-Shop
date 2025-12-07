package com.ecommerce.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private double totalUsers;
    private double totalOrders;
    private double totalRevenue;
    private double totalProducts;
    private double totalCancelledOrders;
    private double totalRefundAmount;
    private double totalCategories;
}
