package com.ecommerce.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryHomeResponse {
    private Long id;
    private String categoryName;
    private String imageUrl;
}
