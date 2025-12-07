package com.ecommerce.service;

import com.ecommerce.entity.User;
import com.ecommerce.request.ChangePasswordRequest;
import com.ecommerce.request.UpdateUserRequest;
import com.ecommerce.response.UserSummaryResponse;

import java.util.List;

public interface UserService {
    User findUserByJwtToken(String jwt) throws Exception;
    User findUserByEmail(String email) throws Exception;
    User updateUserProfile(String email, UpdateUserRequest request) throws Exception;
    void changePassword(String email, ChangePasswordRequest request) throws Exception;
    List<UserSummaryResponse> getAllUsers();
    void deleteUserById(Long userId);
}
