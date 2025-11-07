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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

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

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Create a list of authorities (roles)
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole())); // e.g., "ROLE_USER"

        // Create Spring Security UserDetails object
        // This now correctly uses the user's role
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isVerified(), // enabled (User can't log in if not verified)
                true, // accountNonExpired
                true, // credentialsNonExpired
                user.isActive(), // accountNonLocked (Your 'isActive' field)
                authorities // ✅ Use the roles list
        );
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                if (user.isVerified()) {
                    String token = jwtUtil.generateToken(user.getEmail());
                    // Password hide kar dena before sending to frontend
                    user.setPassword(null);
                    return new LoginResponse("Login successful", true, user, token);
                } else {
                    // User is not verified
                    return new LoginResponse("Please verify your email before logging in.", false, null, null);
                }
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
                    .isPremium(false)
                    .verified(false) // initially false
                    .role("USER")
                    .isActive(true)
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
                .ifPresent(token -> {
                    if ("EMAIL_VERIFICATION".equals(token.getTokenType())) {
                        verificationTokenRepository.delete(token);
                    }
                });

        // 2. Create a new token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .tokenType("EMAIL_VERIFICATION")
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

    @Transactional
    public boolean handleForgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Only send a reset link if the user exists AND is verified
        if (userOptional.isPresent() && userOptional.get().isVerified()) {
            User user = userOptional.get();
            sendPasswordResetEmail(user);
            return true;
        }
        // Silently fail if user doesn't exist or isn't verified
        // This prevents attackers from guessing registered emails
        return false;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(token);

        // Check if token is valid, not expired, AND is a PASSWORD_RESET token
        if (optionalToken.isEmpty() ||
                optionalToken.get().getExpiryDate().isBefore(LocalDateTime.now()) ||
                !"PASSWORD_RESET".equals(optionalToken.get().getTokenType())) {
            return false;
        }

        VerificationToken verificationToken = optionalToken.get();
        User user = verificationToken.getUser();

        // Set the new, encoded password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete the token so it can't be used again
        verificationTokenRepository.delete(verificationToken);

        return true;
    }

    @Transactional
    private void sendPasswordResetEmail(User user) {
        // 1. Delete any old, existing tokens for this user
        verificationTokenRepository.findByUser(user)
                .ifPresent(token -> {
                    if ("PASSWORD_RESET".equals(token.getTokenType())) {
                        verificationTokenRepository.delete(token);
                    }
                });

        // 2. Create a new token
        String token = UUID.randomUUID().toString();
        VerificationToken passwordResetToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .tokenType("PASSWORD_RESET")// 1-hour expiry for password reset
                .build();
        verificationTokenRepository.save(passwordResetToken);

        // 3. Send the email with the *new* reset link
        String link = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendEmail(
                user.getEmail(),
                "Reset Your Password",
                "Click the following link to reset your password: " + link + "\nThis link is valid for 1 hour."
        );
    }
}
