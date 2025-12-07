package com.ecommerce.service.impl;
import com.ecommerce.domain.PaymentMethod;
import com.ecommerce.entity.*;
import com.ecommerce.repo.*;
import com.ecommerce.entity.Address;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.ecommerce.domain.OrderStatus;
import com.ecommerce.domain.PaymentStatus;
import com.ecommerce.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;

    @Override
    @Transactional
    public Order createOrder(User user, Address shippingAddress, Cart cart) {
        System.out.println(user+" "+shippingAddress+" "+cart);

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty, cannot create order.");
        }

        // Ensure user and address are valid
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null when creating an order.");
        }

        if (shippingAddress == null) {
            throw new IllegalArgumentException("Shipping address is required.");
        }

        Order order = new Order();


        order.setUser(user);
        Address savedAddress = addressRepository.save(shippingAddress);
        order.setShippingAddress(savedAddress);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveredDate(LocalDateTime.now().plusDays(7));// estimated delivery date after 7 days
        order.setPaymentDetails(new PaymentDetails());
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderItems(new ArrayList<>());
        order.setPaymentMethod(PaymentMethod.RAZORPAY);


        // If you want to auto-generate orderId

//        order.setOrderId(UUID.randomUUID().toString());


        long totalMrp = 0L;
        long totalSelling = 0L;
        int totalDiscount = 0;
        int totalItems = 0;

        // Convert cart items into order items
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setMrpPrice(cartItem.getMrpPrice());
            orderItem.setSellingPrice(cartItem.getSellingPrice());
            orderItem.setUserId(user.getId());


            order.getOrderItems().add(orderItem);
            // Calculations
            totalMrp += (long) cartItem.getMrpPrice() * cartItem.getQuantity();
            totalSelling += (long) cartItem.getSellingPrice() * cartItem.getQuantity();
            totalItems += cartItem.getQuantity();
        }

        //  Apply totals and discount
        totalDiscount = Math.toIntExact(totalMrp - totalSelling);
        // this can be change later


        order.setTotalMrpPrice(totalMrp);
        order.setTotalSellingPrice(totalSelling);
        order.setDiscount(totalDiscount);
        order.setTotalItem(totalItems);

        // Save order
        Order savedOrder = orderRepository.save(order);


        decreaseStockAfterOrderPlaced(savedOrder);
        //  Clear cart after placing order
        cart.getCartItems().clear();
        cart.setTotalItem(0);
        cart.setTotalMrpPrice(0);
        cart.setTotalSellingPrice(0);
        cart.setDiscount(0);
        cartRepository.save(cart);

        return savedOrder;
    }

    @Override
    public Order findOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(()->
                new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> userOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order cancelOrder(Long orderId, User requester) {
        Order order = findOrderById(orderId);
        if(!requester.getId().equals(order.getUser().getId())) {
            throw new RuntimeException("User can't cancel this order");
        }
        restoreStockAfterCancel(order); // restoring stock
        order.setOrderStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }

    private void restoreStockAfterCancel(Order order) {



        if (order == null || order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order or Order items cannot be null or empty.");
        }
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order already cancelled");
        }
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product == null) continue;

            int restoredQuantity = product.getQuantity() + item.getQuantity();
            product.setQuantity(restoredQuantity);
            product.setUpdatedAt(LocalDateTime.now());
            productRepository.save(product);
        }
    }

    private void decreaseStockAfterOrderPlaced(Order order) {
        if (order == null || order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order or Order items cannot be null or empty.");
        }

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            if (product == null) continue;

            int newQuantity = product.getQuantity() - item.getQuantity();
            if (newQuantity < 0) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getTitle());
            }

            product.setQuantity(newQuantity);
            productRepository.save(product);
        }
    }



    @Override
    public OrderItem getOrderItemById(Long id) {

        return orderItemRepository.findById(id).orElseThrow(()->
                new RuntimeException("Order item not found"));
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status);
    }
}
