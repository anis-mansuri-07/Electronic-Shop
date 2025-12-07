package com.ecommerce.controller.admin;

import com.ecommerce.request.AdminRequest;
import com.ecommerce.response.AdminResponse;
import com.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/admins")
@RequiredArgsConstructor
@CrossOrigin
public class SuperAdminController {

    private final AdminService adminService;

    // Create a new admin
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> createAdmin(@RequestBody AdminRequest request) {
        return new ResponseEntity<>(adminService.createAdmin(request), HttpStatus.CREATED);
    }

    // Update an existing admin
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> updateAdmin(@PathVariable Long id, @RequestBody AdminRequest request) {
        return new ResponseEntity<>(adminService.updateAdmin(id, request), HttpStatus.OK);
    }

    // Get all admins
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<AdminResponse>> getAllAdmins() {
        return new ResponseEntity<>(adminService.getAllAdmins(), HttpStatus.OK);
    }

    // Get single admin by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable Long id) {
        return new ResponseEntity<>(adminService.getAdminById(id), HttpStatus.OK);
    }

    // Delete admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return new ResponseEntity<>("Admin deleted successfully", HttpStatus.OK);
    }
}
