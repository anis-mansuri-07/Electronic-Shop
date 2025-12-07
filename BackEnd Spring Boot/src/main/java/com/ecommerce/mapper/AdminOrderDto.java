package com.ecommerce.mapper;

import com.ecommerce.domain.OrderStatus;
import com.ecommerce.entity.Order;

import java.time.LocalDateTime;

// DTO
public record AdminOrderDto(
        Long id,
        String userEmail,
        int totalItem,
        Long totalSellingPrice,
        OrderStatus orderStatus,
        LocalDateTime orderDate
) {
    public static AdminOrderDto from(Order o) {
        return new AdminOrderDto(
                o.getId(),
                o.getUser() != null ? o.getUser().getEmail() : null,
                o.getTotalItem(),
                o.getTotalSellingPrice(),
                o.getOrderStatus(),
                o.getOrderDate()
        );
    }
}
