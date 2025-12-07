package com.ecommerce.entity;

import com.ecommerce.domain.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.ecommerce.domain.OrderStatus;
import com.ecommerce.domain.PaymentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"orderItems", "paymentOrder"})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;


    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod = PaymentMethod.RAZORPAY;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "address_id",nullable = false)
    private Address shippingAddress;

    @Embedded
    private PaymentDetails paymentDetails = new PaymentDetails();

    private Long totalMrpPrice;

    private Long totalSellingPrice;

    private Integer discount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private int totalItem;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;


    private LocalDateTime orderDate;

    private LocalDateTime deliveredDate;



    // added extra from my side
    @OneToOne(mappedBy = "order")
    @JsonIgnore
    private PaymentOrder paymentOrder;

}

