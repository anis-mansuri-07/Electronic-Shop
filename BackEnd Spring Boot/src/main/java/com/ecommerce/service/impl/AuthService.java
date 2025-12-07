package com.ecommerce.service.impl;

import lombok.RequiredArgsConstructor;
import com.ecommerce.domain.OtpPurpose;
import com.ecommerce.domain.Role;
import com.ecommerce.entity.Admin;
import com.ecommerce.entity.User;
import com.ecommerce.entity.VerificationCode;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import com.ecommerce.repo.AdminRepository;
import com.ecommerce.repo.UserRepository;
import com.ecommerce.repo.VerificationCodeRepository;
import com.ecommerce.util.OtpUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    /**
     * Login method for both User and Admin
     */
    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();

        //  Check user/admin first
        String role;
        String username ;
        User user = userRepository.findByEmail(email);

        Optional<Admin> admin = adminRepository.findByEmail(email);

        if (user != null) {
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }
            username = user.getFullName();

            role = user.getRole().name();
        } else if (admin.isPresent()) {
            if (!passwordEncoder.matches(password, admin.get().getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }
            username = "Admin";
            role = admin.get().getRole().name();
        } else {
            throw new RuntimeException("No account found with this email.");
        }

        //  Authenticate (optional but for Spring Security context)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        //  Generate JWT
        String token = jwtService.generateToken(email, role);

        return new AuthResponse(token, Role.valueOf(role), "Login successful",username);
    }

    /**
     * Register new user after validating OTP
     */
    public void registerUser(String email, String fullName, String phoneNumber,
                             String password, String otp) throws Exception {

        // Validate OTP
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);
        if (verificationCode == null || verificationCode.isUsed()) {
            throw new Exception("OTP not found or already used");
        }
        if (!verificationCode.getOpt().equals(otp)) {
            throw new Exception("Invalid OTP");
        }
        if (System.currentTimeMillis() > verificationCode.getExpiryTime()) {
            throw new Exception("OTP expired");
        }

        // Check if user exists
        if (userRepository.existsByEmail(email) ) {
            throw new Exception("User already exists with this email.");
        }

        // Create user
        User user = User.builder()
                .email(email)
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .password(passwordEncoder.encode(password))
                .isVerified(true)
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);

        // Mark OTP as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
    }


    public void otpForRegister(String email) throws Exception {

        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user != null || adminRepository.findByEmail(email).isPresent()) {
            throw new Exception("User already exists with this email. Please register instead.");
        }
        String otp = OtpUtil.generateOtp();
        String subject = "One-Time Password (OTP) for Account Creation";
        String text = "Dear User,\n\n" +
                "We received a request to create your account on eShop.\n\n" +
                "Your One-Time Password (OTP) is:\n\n" + otp + "\n\n" +
                "❌ Do not share this code with anyone. Our team will never ask you for your OTP.\n\n" +
                "If you did not request this, please ignore this email or contact our support.\n\n" +
                "Thank you,\nTeam eShop\n[Support Email: eshop@support.com]\n";


        // Delete old OTP if exists
        VerificationCode existing = verificationCodeRepository.findByEmail(email);
        if (existing != null) {
            verificationCodeRepository.delete(existing);
        }

        // Save new OTP
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOpt(otp);
        verificationCode.setEmail(email);
        verificationCode.setPurpose(OtpPurpose.REGISTER);
        verificationCode.setExpiryTime(System.currentTimeMillis() + 5 * 60 * 1000);
        verificationCode.setUsed(false);
        verificationCodeRepository.save(verificationCode);

        // Send email
        emailService.sendVerificationOtpEmail(email, subject, text);
    }


    public void sendForgotPasswordOtp(String email) throws Exception {

        // 1️⃣ Check if user/admin exists
        boolean isUser = false;
        boolean isAdmin = false;

        User user = userRepository.findByEmail(email);
        if (user != null) isUser = true;

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) isAdmin = true;

        if (!isUser && !isAdmin) {
            throw new Exception("No account found with this email.");
        }

        // 2️⃣ Generate OTP
        String otp = OtpUtil.generateOtp();

        // 3️⃣ Delete old OTP if exists
        VerificationCode existing = verificationCodeRepository.findByEmail(email);
        if (existing != null) {
            verificationCodeRepository.delete(existing);
        }

        // 4️⃣ Save new OTP
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setOpt(otp);
        verificationCode.setPurpose(OtpPurpose.FORGOT_PASSWORD);
        verificationCode.setExpiryTime(System.currentTimeMillis() + 5 * 60 * 1000); // 5 min
        verificationCode.setUsed(false);
        verificationCodeRepository.save(verificationCode);

        // 5️⃣ Send email
        String subject = isAdmin ? "Admin Password Reset OTP" : "User Password Reset OTP";
        String text = "Dear " + (isAdmin ? "Admin" : "User") + ",\n\n" +
                "We received a request to reset your password.\n" +
                "Your One-Time Password (OTP) is:\n\n" + otp + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Thank you,\nTeam eShop";

        emailService.sendVerificationOtpEmail(email, subject, text);
    }

    public void resetPassword(String email, String otp, String newPassword) throws Exception {

        // Fetch OTP
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);
        if (verificationCode == null) {
            throw new Exception("OTP not found for this email.");
        }

        // Validate OTP
        if (verificationCode.isUsed()) {
            throw new Exception("OTP has already been used.");
        }

        if (!verificationCode.getOpt().equals(otp)) {
            throw new Exception("Invalid OTP.");
        }

        if (System.currentTimeMillis() > verificationCode.getExpiryTime()) {
            throw new Exception("OTP expired. Please request a new one.");
        }

        // Update password
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            Optional<Admin> admin = adminRepository.findByEmail(email);
            if (admin.isPresent()) {
                admin.get().setPassword(passwordEncoder.encode(newPassword));
                adminRepository.save(admin.get());
            } else {
                throw new Exception("No account found with this email.");
            }
        }

        // Mark OTP as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
    }



}


