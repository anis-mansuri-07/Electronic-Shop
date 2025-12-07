package com.ecommerce.mapper;

public record AdminOrderItemDto(
        Long id,
        String productName,
        Integer quantity,
        Long sellingPrice,
        Long totalPrice
) {}
