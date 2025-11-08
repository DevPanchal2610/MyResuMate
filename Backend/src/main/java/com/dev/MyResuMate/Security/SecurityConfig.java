package com.dev.MyResuMate.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order; // ✅ Import Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // We keep your existing CORS config
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ✅ BEAN 1: API Security (Stateless, for React)
    @Bean
    @Order(1) // This chain runs first
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**") // Apply this chain ONLY to /api/** paths
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Your existing public API paths
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/templates/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll()
                        .requestMatchers("/api/ats/**").permitAll()
                        .requestMatchers("/api/contact/**").permitAll()
                        .requestMatchers("/api/payments/**").permitAll()
                        .requestMatchers("/api/plans/**").permitAll()
                        .requestMatchers("/api/subscriptions/**").permitAll()
                        // All other /api paths are protected
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // ❗️ STATELESS for API
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Use JWT filter

        return http.build();
    }

    // ✅ BEAN 2: Admin Panel Security (Stateful, for Thymeleaf)
    @Bean
    @Order(2) // This chain runs second
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/admin/**", "/admin-auth") // Apply this chain to /admin/** and our bridge
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin-auth").permitAll() // The bridge endpoint must be public
                        .requestMatchers("/admin/**").hasAuthority("ADMIN") // Only allow users with "ADMIN" authority
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // ❗️ STATEFUL for Admin (default)
                )
                .formLogin(form -> form // Add a default login form as a fallback
                        .loginPage("/admin/login") // A custom login URL (we'll create this later if needed)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/admin/logout")
                        .logoutSuccessUrl("/?logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        // We DO NOT add the JwtFilter here, as this is session-based.

        return http.build();
    }
}