package com.ecommerce.service;


import com.ecommerce.domain.PaymentMethod;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.PaymentOrder;
import com.ecommerce.entity.User;
import com.stripe.exception.StripeException;

import java.util.Set;

public interface PaymentService {
    PaymentOrder createPaymentOrder(User user, Order order, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderByPaymentLinkId(String paymentLinkId);
    PaymentOrder getPaymentOrderByPaymentId(String orderId);
    Boolean proceedPaymentOrder(PaymentOrder paymentOrder,
                                String paymentId,
                                String paymentLinkedId) throws RazorpayException;

    PaymentLink createRazorPayPaymentLink(User user,
                                          Long amount,
                                          Long orderId) throws RazorpayException;


}