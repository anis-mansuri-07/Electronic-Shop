package com.ecommerce.config;

import lombok.RequiredArgsConstructor;
import com.ecommerce.domain.Role;
import com.ecommerce.entity.Admin;
import com.ecommerce.repo.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String defaultAdminEmail = "kanu7869292@gmail.com";

        // check if admin already exists
        if (adminRepository.findByEmail(defaultAdminEmail).isEmpty()) {

            Admin admin = new Admin();
            admin.setAdminName("Admin Pro Max");
            admin.setEmail(defaultAdminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123")); // default password
            admin.setRole(Role.ROLE_SUPER_ADMIN);
            adminRepository.save(admin);

            System.out.println("Default admin created: " + defaultAdminEmail);
        }
    }
}

