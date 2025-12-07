package com.ecommerce.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.OtpRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.request.ResetPassRequest;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.service.impl.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse> sendRegisterOtp(@RequestBody OtpRequest request) throws Exception {
        authService.otpForRegister(request.getEmail().toLowerCase());
        return ResponseEntity.ok(new ApiResponse("OTP sent successfully for registration"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody RegisterRequest request) throws Exception {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        authService.registerUser(
                request.getEmail().toLowerCase(),
                request.getFullName(),
                request.getPhoneNumber(),
                request.getPassword(),
                request.getOtp()
        );

        return ResponseEntity.ok(new ApiResponse("User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) throws Exception {
        AuthResponse response = authService.login(request);
//        response.setUsername();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse> sendForgotPasswordOtp(@RequestBody OtpRequest request) throws Exception {
        authService.sendForgotPasswordOtp(request.getEmail().toLowerCase());
        return ResponseEntity.ok(new ApiResponse("OTP sent successfully for password reset"));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPassRequest request) throws Exception {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        authService.resetPassword(
                request.getEmail().toLowerCase(),
                request.getOtp(),
                request.getPassword()
        );

        return ResponseEntity.ok(new ApiResponse("Password updated successfully now you can login") );
    }
}
