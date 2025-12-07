package com.ecommerce.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String categoryName;
    private String imageUrl;
    private int productCount;
}
