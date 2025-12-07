package com.ecommerce.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {
    private Long orderId;
    private int amount;
    private String paymentMethod;
    private String message;
    private String paymentUrl; // optional, if you integrate Razorpay or other
    private String paymentLinkId; // Razorpay payment link identifier for client-side verification
}
