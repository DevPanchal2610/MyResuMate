package com.dev.MyResuMate.Service;


import com.dev.MyResuMate.DTO.LoginRequest;
import com.dev.MyResuMate.DTO.LoginResponse;
import com.dev.MyResuMate.DTO.SignupRequest;
import com.dev.MyResuMate.DTO.SignupResponse;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Model.VerificationToken;
import com.dev.MyResuMate.Repository.UserRepository;
import com.dev.MyResuMate.Repository.VerificationTokenRepository;
import com.dev.MyResuMate.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailService emailService;

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail());
                // Password hide kar dena before sending to frontend
                user.setPassword(null);
                return new LoginResponse("Login successful", true, user, token);
            } else {
                return new LoginResponse("Invalid password", false, null, null);
            }
        } else {
            return new LoginResponse("User not found", false, null, null);
        }
    }


    @Transactional
    public SignupResponse signup(SignupRequest request) {
        Optional<User> existingUserOptional = userRepository.findByEmail(request.getEmail());

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            if (existingUser.isVerified()) {
                // CASE 1: User exists and IS verified. Block them.
                return new SignupResponse("Email already in use", false, null);
            } else {
                // CASE 2: User exists but is UNVERIFIED. Resend token.

                // Update their details in case they changed them
                existingUser.setName(request.getName());
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(existingUser);

                // Resend the verification email
                sendVerificationEmail(existingUser);

                return new SignupResponse(
                        "Signup successful! Please check your email to verify your account.",
                        true,
                        null // No need to send user object, they aren't logged in
                );
            }
        } else {
            // CASE 3: This is a brand new user.
            User newUser = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword())) // 🔐 hash password
                    .premium(false)
                    .verified(false) // initially false
                    .build();

            User savedUser = userRepository.save(newUser);

            // Send the verification email
            sendVerificationEmail(savedUser);

            return new SignupResponse(
                    "Signup successful! Please check your email to verify your account.",
                    true,
                    savedUser
            );
        }
    }

    // ⭐️ ADD THIS NEW HELPER METHOD AT THE BOTTOM OF YOUR CLASS
    /**
     * Helper method to create/reset a verification token and send the email.
     * This is @Transactional to ensure the delete/save operations are safe.
     */
    @Transactional
    private void sendVerificationEmail(User user) {
        // 1. Delete any old, existing tokens for this user
        verificationTokenRepository.findByUser(user)
                .ifPresent(token -> verificationTokenRepository.delete(token));

        // 2. Create a new token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(verificationToken);

        // 3. Send the email
        String link = "http://localhost:3000/verify?token=" + token;
        emailService.sendEmail(
                user.getEmail(),
                "Verify your account",
                "Click the following link to verify your account: " + link
        );
    }
}
