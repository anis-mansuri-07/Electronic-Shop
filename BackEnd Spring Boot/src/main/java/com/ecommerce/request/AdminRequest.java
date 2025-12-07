package com.ecommerce.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRequest {
    private String adminName;
    private String email;
    private String password;
}
