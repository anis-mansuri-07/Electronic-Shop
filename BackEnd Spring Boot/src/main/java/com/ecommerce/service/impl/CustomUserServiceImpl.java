package com.ecommerce.service.impl;

import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.Admin;
import com.ecommerce.entity.User;
import com.ecommerce.repo.AdminRepository;
import com.ecommerce.repo.UserRepository;
import com.ecommerce.service.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check Admin first
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) return new CustomUserDetails(admin.get().getEmail(), admin.get().getPassword(), admin
                .get().getRole().name());

        // Check User
        User user = userRepository.findByEmail(email);
        if (user != null) return new CustomUserDetails(user.getEmail(), user.getPassword(), user
                .getRole().name());

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}

