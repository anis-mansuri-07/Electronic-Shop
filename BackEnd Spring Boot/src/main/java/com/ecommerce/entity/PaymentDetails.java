package com.ecommerce.entity;

import lombok.Data;
import com.ecommerce.domain.PaymentStatus;

@Data
public class PaymentDetails {
    private String  paymentId;
    private String razorpayPaymentLinkId;
    private String razorpayPaymentLinkReferenceId;
    private String razorpayPaymentLinkStatus;
    private String razorpayPaymentLinkIdZWSP;
    private PaymentStatus status;
}

