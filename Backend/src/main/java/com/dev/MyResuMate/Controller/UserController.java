package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.*;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Model.VerificationToken;
import com.dev.MyResuMate.Repository.UserRepository;
import com.dev.MyResuMate.Repository.VerificationTokenRepository;
import com.dev.MyResuMate.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.login(loginRequest);

        if (response.isSuccess()) {
            // ✅ Successful login
            return ResponseEntity.ok(response);
        } else if ("Invalid password".equals(response.getMessage())) {
            // ❌ Wrong password → return 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } else {
            // ❌ User not found → return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @Transactional
    @PostMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestBody VerifyRequest request) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(request.getToken());

        if (optionalToken.isEmpty() || optionalToken.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired verification token");
        }

        VerificationToken verificationToken = optionalToken.get();
        User user = verificationToken.getUser();

        // Extra check: what if user is already verified?
        if (user.isVerified()) {
            verificationTokenRepository.delete(verificationToken); // Clean up the token
            return ResponseEntity.ok("Email already verified. You can log in.");
        }

        user.setVerified(true);
        userRepository.save(user);
        // Delete the token *after* successful verification
        verificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Email verified successfully! You may now log in.");
    }


}
