package com.ecommerce.response;

import com.ecommerce.domain.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResponse {
    private Long id;
    private String adminName;
    private String email;
    private Role role;
}
