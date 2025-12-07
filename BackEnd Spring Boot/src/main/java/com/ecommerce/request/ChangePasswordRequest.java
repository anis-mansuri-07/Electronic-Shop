package com.ecommerce.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Old Password Is Required")
    private String oldPassword;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters, include uppercase, lowercase, number, special character (!@#$%^&*), and no spaces"
    )
    private String newPassword;


}