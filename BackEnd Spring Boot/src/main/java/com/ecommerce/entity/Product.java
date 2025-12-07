package com.ecommerce.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private String description;

    private int mrpPrice;

    private int sellingPrice;

    private int discountPercent;

    private int quantity;

    private String color;

//    Changes Recently
    private String brand;

    // it will create a separate table for this field
    @ElementCollection
    private List<String> images = new ArrayList<>();

    @ManyToOne
    private Category category;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;






}

