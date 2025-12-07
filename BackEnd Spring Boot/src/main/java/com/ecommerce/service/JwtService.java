package com.ecommerce.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import com.ecommerce.config.JWT_CONSTANT;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;


@Service
@RequiredArgsConstructor
public class JwtService {

    private final JWT_CONSTANT jwtConstant ;
    private SecretKey key;
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtConstant.getSecretKey().getBytes());
    }
    // Generates JWT using email and role
    public String generateToken(String email, String role) {
        // 24 hours
        long jwtExpirationMs = 24 * 60 * 60 * 1000L;
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConstant.getExpiration()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email from token
    public String getEmailFromJwtToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token); // returns Jws<Claims>

        Claims claims = claimsJws.getBody();
        return claims.getSubject(); // your email
    }

    // Extract role from token
    public String getRoleFromJwtToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
}
