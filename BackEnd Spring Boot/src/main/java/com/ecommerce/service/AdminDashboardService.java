package com.ecommerce.service;


import com.ecommerce.response.DashboardStatsResponse;

import java.util.Map;

public interface AdminDashboardService {
    DashboardStatsResponse getDashboardStats();
    Map<String, Long> getOrderStatusSummary();
}
