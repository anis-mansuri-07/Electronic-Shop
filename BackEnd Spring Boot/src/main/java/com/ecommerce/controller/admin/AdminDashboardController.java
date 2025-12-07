package com.ecommerce.controller.admin;

import com.ecommerce.response.DashboardStatsResponse;
import com.ecommerce.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    // Users, Orders, Revenue, Products, Cancelled Orders
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // Orders status for Pie Chart
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/order-status")
    public ResponseEntity<Map<String, Long>> getOrderStatusSummary() {
        return ResponseEntity.ok(dashboardService.getOrderStatusSummary());
    }
}
