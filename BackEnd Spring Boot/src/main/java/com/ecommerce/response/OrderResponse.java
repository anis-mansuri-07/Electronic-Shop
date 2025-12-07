package com.ecommerce.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ecommerce.entity.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String userEmail;
    private int totalSellingPrice;
    private Long totalMrpPrice;
    private int discount;
    private int totalItem;
    private String orderStatus;
    private LocalDateTime orderDate;
    private LocalDateTime deliveredDate;
//    private PaymentDetailsResponse paymentDetails;
    private List<OrderItemResponse> items;

    public OrderResponse(Order order) {
        this.id = order.getId();
//        this.orderId = order.getOrderId();
        this.userEmail = order.getUser() != null ? order.getUser().getEmail() : null;
        this.totalSellingPrice = Math.toIntExact(order.getTotalSellingPrice() != null ? order.getTotalSellingPrice() : 0);
        this.totalMrpPrice = order.getTotalMrpPrice();
        this.discount = order.getDiscount() != null ? order.getDiscount() : 0;
        this.totalItem = order.getTotalItem();
        this.orderStatus = order.getOrderStatus() != null ? order.getOrderStatus().name() : null;
        this.orderDate = order.getOrderDate();
        this.deliveredDate = order.getDeliveredDate();
//        this.paymentDetails = order.getPaymentDetails() != null ? new PaymentDetailsResponse(order.getPaymentDetails()) : null;
        this.items = order.getOrderItems().stream().map(OrderItemResponse::new).collect(Collectors.toList());
    }
}
