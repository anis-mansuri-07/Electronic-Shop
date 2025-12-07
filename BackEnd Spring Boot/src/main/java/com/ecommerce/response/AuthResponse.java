package com.ecommerce.response;

import lombok.*;
import com.ecommerce.domain.Role;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String jwt;
    private Role role;
    private String message;
    private String username;
}
