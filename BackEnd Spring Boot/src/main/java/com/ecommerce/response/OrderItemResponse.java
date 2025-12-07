package com.ecommerce.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ecommerce.entity.OrderItem;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private int sellingPrice;
    private int totalPrice;

    public OrderItemResponse(OrderItem item) {
        this.id = item.getId();
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getTitle();
        this.quantity = item.getQuantity();
        this.sellingPrice = item.getProduct().getSellingPrice();
        this.totalPrice = this.quantity * this.sellingPrice;
    }
}


