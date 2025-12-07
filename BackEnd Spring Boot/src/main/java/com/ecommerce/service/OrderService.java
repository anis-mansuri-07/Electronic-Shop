package com.ecommerce.service;

import com.ecommerce.domain.OrderStatus;
import com.ecommerce.entity.*;
import com.ecommerce.entity.Address;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, Address shippingAddress, Cart cart);
    Order findOrderById(Long id);
    List<Order> userOrderHistory(Long userId);
    Order updateOrderStatus(Long orderId, OrderStatus orderStatus);
    Order cancelOrder(Long orderId,User requester);
    OrderItem getOrderItemById(Long id);

    List<Order> getAllOrders();


    List<Order> getOrdersByStatus(OrderStatus status);  // for admin only



}
