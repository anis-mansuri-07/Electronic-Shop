package com.ecommerce.controller.admin;


import com.ecommerce.entity.Admin;
import com.ecommerce.repo.AdminRepository;
import com.ecommerce.request.ChangePasswordRequest;
import com.ecommerce.response.AdminResponse;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> getAdminProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);

        if (adminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Admin admin = adminOpt.get();
        AdminResponse response = AdminResponse.builder()
                .id(admin.getId())
                .adminName(admin.getAdminName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .build();

        return ResponseEntity.ok(response);
    }

    // Change Password for admin and super admin
    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        adminService.changePassword(email, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(new ApiResponse("Password changed successfully"));
    }
}
