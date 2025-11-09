package com.dev.MyResuMate.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        // ✅ Skip JWT processing for public endpoints
        if (requestPath.startsWith("/admin") ||
                requestPath.startsWith("/admin-auth") ||
                requestPath.startsWith("/admin/login") ||
                requestPath.startsWith("/api/auth/login") ||
                requestPath.startsWith("/api/auth/signup") ||
                requestPath.startsWith("/api/auth/verify") ||
                requestPath.startsWith("/api/auth/forgot-password") ||
                requestPath.startsWith("/api/auth/reset-password") ||
                requestPath.startsWith("/api/contact/submit") ||
                requestPath.startsWith("/api/plans") ||
                requestPath.startsWith("/api/templates")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token)) {
                    email = jwtUtil.getEmailFromToken(token);
                }
            } catch (Exception e) {
                // This will catch expired tokens, etc.
                logger.warn("Invalid JWT token: " + e.getMessage());
            }
        }

        // ❗️ vvvvvv THIS IS THE NEW, CRITICAL LOGIC vvvvvv
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from the database (via UserService)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            // Create an authentication token
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null, // We don'T need credentials, token is already validated
                    userDetails.getAuthorities()
            );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Set the authentication in the Spring Security Context
            // This is the line that "logs the user in" for this request
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        // ❗️ ^^^^^^ END OF NEW LOGIC ^^^^^^

        // Optionally, set SecurityContext if needed for user details
        filterChain.doFilter(request, response);
    }
}
