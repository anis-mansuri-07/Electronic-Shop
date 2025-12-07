package com.ecommerce.controller;

import com.ecommerce.entity.*;
import com.ecommerce.repo.PaymentOrderRepository;
import com.ecommerce.entity.Address;
import com.ecommerce.service.PaymentService;
import com.razorpay.PaymentLink;
import lombok.RequiredArgsConstructor;
import com.ecommerce.domain.PaymentMethod;
import com.ecommerce.response.OrderItemResponse;
import com.ecommerce.response.OrderResponse;
import com.ecommerce.response.PaymentLinkResponse;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;

    private User getCurrentUser() throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findUserByEmail(email);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentLinkResponse> createOrder(
            @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod) throws Exception {

        User user = getCurrentUser();
        Cart cart = cartService.findUserCart(user);

        Order order = orderService.createOrder(user, shippingAddress, cart);

        PaymentOrder paymentOrder = paymentService.createPaymentOrder(user, order, paymentMethod);

        if (!paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            throw new Exception("Currently only Razorpay payment method is supported");
        }

        PaymentLink paymentLink = paymentService.createRazorPayPaymentLink(user, paymentOrder.getAmount(),
                order.getId());
        String paymentUrl = paymentLink.get("short_url");
        String paymentLinkId = paymentLink.get("id");

        PaymentLinkResponse response = new PaymentLinkResponse();
        response.setOrderId(order.getId());
        response.setAmount(Math.toIntExact(order.getTotalSellingPrice()));
        response.setPaymentMethod(paymentMethod.name());
        response.setMessage("Payment link created successfully");
        response.setPaymentUrl(paymentUrl);
        response.setPaymentLinkId(paymentLinkId);

        // paymentOrder updated inside service with link id & status; ensure id mirrored
        // if needed
        if (paymentOrder.getPaymentLinkId() == null || !paymentOrder.getPaymentLinkId().equals(paymentLinkId)) {
            paymentOrder.setPaymentLinkId(paymentLinkId);
            paymentOrderRepository.save(paymentOrder);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderResponse>> getUserOrderHistory() throws Exception {
        User user = getCurrentUser();
        List<Order> orders = orderService.userOrderHistory(user.getId());

        List<OrderResponse> response = orders.stream()
                .map(OrderResponse::new) // map entity to DTO
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) throws Exception {
        User user = getCurrentUser();
        Order order = orderService.findOrderById(orderId);

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(new OrderResponse(order));
    }

    @GetMapping("/item/{orderItemId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderItemResponse> getOrderItemById(@PathVariable Long orderItemId) throws Exception {
        User user = getCurrentUser();
        OrderItem orderItem = orderService.getOrderItemById(orderItemId);

        if (!orderItem.getOrder().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(new OrderItemResponse(orderItem));
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId) throws Exception {
        User user = getCurrentUser();
        Order canceledOrder = orderService.cancelOrder(orderId, user);

        return ResponseEntity.ok(new OrderResponse(canceledOrder));
    }
}
