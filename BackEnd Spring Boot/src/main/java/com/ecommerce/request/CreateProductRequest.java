package com.ecommerce.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {

    @NotBlank(message = "Product title is required")
    private String title;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "MRP price is required")
    @Positive(message = "MRP price must be greater than zero")
    private Integer mrpPrice;

    @NotNull(message = "Selling price is required")
    @PositiveOrZero(message = "Selling price must be zero or positive")
    private Integer sellingPrice;

    private String color;

    @NotEmpty(message = "At least one image is required")
    private List<@NotBlank(message = "Image URL cannot be blank") String> images;

    @NotBlank(message = "Category name is required")
    private String category;

    @PositiveOrZero(message = "Quantity must be zero or more")
    private Integer quantity;

    // Optional fields
    private String brand;

}
