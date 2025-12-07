package com.ecommerce.service.impl;

import com.ecommerce.domain.OrderStatus;
import com.ecommerce.domain.PaymentMethod;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import com.ecommerce.domain.PaymentOrderStatus;
import com.ecommerce.domain.PaymentStatus;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.PaymentOrder;
import com.ecommerce.entity.User;
import com.ecommerce.repo.OrderRepository;
import com.ecommerce.repo.PaymentOrderRepository;
import com.ecommerce.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;

    @Value("${razorpay.key}")
    private String apiKey;

    @Value("${razorpay.secret}")
    private String apiSecret;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    @Override
    public PaymentOrder createPaymentOrder(User user, Order orders, PaymentMethod paymentMethod) {
        Long amount = orders.getTotalSellingPrice();
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setAmount(amount);
        paymentOrder.setUser(user);
        paymentOrder.setOrder(orders);
        paymentOrder.setPaymentMethod(paymentMethod);
        return paymentOrderRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentLinkId(String id) {
        PaymentOrder byPaymentLinkId = paymentOrderRepository.findByPaymentLinkId(id);
        if (byPaymentLinkId == null)
            throw new RuntimeException("Payment order not found with provided payment link id");
        return byPaymentLinkId;

    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String orderId) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(orderId);
        if (paymentOrder == null)
            throw new RuntimeException("Payment order not found with provided payment id");
        return paymentOrder;
    }

    @Override
    public Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkedId)
            throws RazorpayException {

        try {
            if (paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {

                RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
                Payment payment = razorpayClient.payments.fetch(paymentId);

                if (payment.get("status").equals("captured")) {

                    // Fetch linked order
                    Order order = paymentOrder.getOrder();
                    if (order == null) {
                        throw new RuntimeException("No order linked with payment order");
                    }

                    // Update order details
                    order.setPaymentStatus(PaymentStatus.COMPLETED);

                    order.setOrderStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);

                    // Update payment order details
                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    paymentOrderRepository.save(paymentOrder);

                    return true;
                }

            }
            // If payment not captured
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
        } catch (Exception e) {
            System.out.printf(e.getMessage());
        }

        return false;
    }

    @Override
    public PaymentLink createRazorPayPaymentLink(User user, Long amount, Long orderId) throws RazorpayException {
        amount = amount * 100; // convert to paise (Razorpay expects smallest currency unit)
        try {
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
            JSONObject paymentLinkRequest = buildPaymentLinkRequest(user, amount, orderId);

            PaymentLink paymentLink = razorpayClient.paymentLink.create(paymentLinkRequest);

            String paymentLinkUrl = paymentLink.get("short_url");
            String paymentLinkId = paymentLink.get("id");

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

            PaymentOrder paymentOrder = paymentOrderRepository.findByOrder(order);
            if (paymentOrder == null) {
                throw new RuntimeException("Payment order not found for order id: " + orderId);
            }

            paymentOrder.setPaymentLinkId(paymentLinkId);
            paymentOrder.setStatus(PaymentOrderStatus.PENDING);
            paymentOrderRepository.save(paymentOrder);
            return paymentLink;

        } catch (Exception e) {
            System.out.printf(e.getMessage());
            throw new RazorpayException(e.getMessage());
        }

    }

    private JSONObject buildPaymentLinkRequest(User user, Long amount, Long orderId) {
        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amount);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("name", user.getFullName());
        customer.put("email", user.getEmail());
        paymentLinkRequest.put("customer", customer);

        JSONObject notify = new JSONObject();
        notify.put("email", true);
        paymentLinkRequest.put("notify", notify);

        // Frontend route will parse payment_id & payment_link_id from query params
        // appended by Razorpay
        paymentLinkRequest.put("callback_url", frontendBaseUrl + "/payment-success/" + orderId);
        // paymentLinkRequest.put("callback_url",
        // "https://your-backend-domain/api/payment/callback"); this is for backend
        // callback

        paymentLinkRequest.put("callback_method", "get");
        return paymentLinkRequest;
    }
}
