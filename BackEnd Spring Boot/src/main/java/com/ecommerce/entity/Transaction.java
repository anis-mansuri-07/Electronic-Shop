package com.ecommerce.entity;

import com.ecommerce.domain.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="payment_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user;

   private Long amount;

    @OneToOne
    private Order order;

    private String status;

   private String paymentId;
   private String paymentLinkId;

   private PaymentMethod paymentMethod;

    private LocalDateTime date = LocalDateTime.now();



}
