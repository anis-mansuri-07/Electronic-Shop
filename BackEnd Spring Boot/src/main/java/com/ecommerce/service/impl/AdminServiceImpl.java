package com.ecommerce.service.impl;

import com.ecommerce.domain.Role;
import com.ecommerce.entity.Admin;
import com.ecommerce.repo.AdminRepository;
import com.ecommerce.request.AdminRequest;
import com.ecommerce.response.AdminResponse;
import com.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
        Optional<Admin> admin = adminRepository.findByEmail(email);

        if(admin.isEmpty()) throw new RuntimeException("Admin not found with email: " + email);

        if (!passwordEncoder.matches(oldPassword, admin.get().getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        admin.get().setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin.get());
    }

    @Override
    public AdminResponse createAdmin(AdminRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin already exists with email: " + request.getEmail());
        }

        Admin admin = new Admin();
        admin.setAdminName(request.getAdminName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Role.ROLE_ADMIN);

        Admin saved = adminRepository.save(admin);
        return mapToResponse(saved);
    }

    @Override
    public AdminResponse updateAdmin(Long id, AdminRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + id));

        if(admin.getRole() == Role.ROLE_SUPER_ADMIN) {
            throw new RuntimeException("Cannot update the Super Admin!");
        }
        if(request.getEmail()!=null){
            admin.setEmail(request.getEmail());
        }
        if (request.getPassword()!=null){
            admin.setPassword(request.getPassword());
        }
        if(request.getAdminName()!=null){
            admin.setAdminName(request.getAdminName());
        }


        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Admin updated = adminRepository.save(admin);
        return mapToResponse(updated);
    }

    @Override
    public AdminResponse getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + id));
        return mapToResponse(admin);
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll().stream()
                .filter(a -> a.getRole() == Role.ROLE_ADMIN) // Only admins, not super admin
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + id));

        if (admin.getRole() == Role.ROLE_SUPER_ADMIN) {
            throw new RuntimeException("Cannot delete the Super Admin!");
        }

        adminRepository.deleteById(id);
    }

    private AdminResponse mapToResponse(Admin admin) {
        return AdminResponse.builder()
                .id(admin.getId())
                .adminName(admin.getAdminName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .build();
    }
}
