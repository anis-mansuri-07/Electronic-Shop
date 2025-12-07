package com.ecommerce.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import com.ecommerce.service.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;


@Component
@RequiredArgsConstructor
public class JWTTokenValidator extends OncePerRequestFilter {
    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();


        // Skip JWT validation for all auth-related endpoints and preflight
        if (request.getMethod().equalsIgnoreCase("OPTIONS") ||
                path.startsWith("/auth") ||
                path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(JWT_CONSTANT.JWT_HEADER);
        if (header == null || !header.startsWith("Bearer ")) {
            // No token provided -> continue as anonymous (will be rejected later if endpoint requires auth)
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // remove "Bearer "

        try {
            String email = jwtService.getEmailFromJwtToken(token);
            String role = jwtService.getRoleFromJwtToken(token);

            // ensure role has ROLE_ prefix required by hasRole(...)
            String authority = role != null && role.startsWith("ROLE_") ? role : "ROLE_" + role;

            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authority));
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid JWT token", e);
        }


        filterChain.doFilter(request, response);
    }

}

