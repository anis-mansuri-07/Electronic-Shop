package com.ecommerce.service;

import com.ecommerce.request.AdminRequest;
import com.ecommerce.response.AdminResponse;

import java.util.List;

public interface AdminService {
    void changePassword(String email, String oldPassword, String newPassword);
    AdminResponse createAdmin(AdminRequest request);
    AdminResponse updateAdmin(Long id, AdminRequest request);
    AdminResponse getAdminById(Long id);
    List<AdminResponse> getAllAdmins();
    void deleteAdmin(Long id);
}
