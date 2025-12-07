package com.ecommerce.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.WishList;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishListResponse {

    private Long userId;
    private List<ProductResponse> products;

    // Constructor to convert WishList entity to DTO
    public WishListResponse(WishList wishList) {
        this.userId = wishList.getUser().getId();
        this.products = wishList.getProducts().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    // Nested DTO for Product to avoid exposing entity directly
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductResponse {
        private Long id;
        private String title;
        private String description;
        private Integer mrpPrice;
        private Integer sellingPrice;
        private String color;
        private List<String> images;
        private String category;

        public ProductResponse(Product product) {
            this.id = product.getId();
            this.title = product.getTitle();
            this.description = product.getDescription();
            this.mrpPrice = product.getMrpPrice();
            this.sellingPrice = product.getSellingPrice();
            this.color = product.getColor();
            this.images = product.getImages();
            this.category = product.getCategory() != null ? product.getCategory().getCategoryName() : null;
        }
    }
}
