package com.ecommerce.service.impl;

import com.ecommerce.domain.OrderStatus;
import com.ecommerce.entity.Order;
import com.ecommerce.repo.CategoryRepository;
import com.ecommerce.repo.OrderRepository;
import com.ecommerce.repo.ProductRepository;
import com.ecommerce.repo.UserRepository;
import com.ecommerce.response.DashboardStatsResponse;
import com.ecommerce.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;


    @Override
    public DashboardStatsResponse getDashboardStats() {
        double totalUsers = userRepository.count();
        double totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() != OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalSellingPrice)
                .sum();
        double totalProducts = productRepository.count();
        double totalCancelledOrders = orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.CANCELLED)
                .count();

        double totalRefundAmount = orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalSellingPrice)
                .sum();

        double totalCategory = categoryRepository.count();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalProducts(totalProducts)
                .totalCancelledOrders(totalCancelledOrders)
                .totalRefundAmount(totalRefundAmount)
                .totalCategories(totalCategory)
                .build();
    }

    @Override
    public Map<String, Long> getOrderStatusSummary() {
        return orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderStatus().name(),
                        Collectors.counting()
                ));
    }
}
