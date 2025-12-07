package com.ecommerce.response;

import com.ecommerce.entity.CartItem;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private int quantity;
    private Long productId;
    private String productName;
    private int productPrice;

    public CartItemResponse(CartItem item) {
        this.id = item.getId();
        this.quantity = item.getQuantity();
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getTitle();
        this.productPrice = item.getProduct().getSellingPrice();
    }
}

