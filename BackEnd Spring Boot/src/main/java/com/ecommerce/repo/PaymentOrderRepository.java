package com.ecommerce.repo;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder,Long> {
    PaymentOrder findByPaymentLinkId(String paymentId);

    PaymentOrder findByOrder(Order order);
}
