package com.dev.MyResuMate.Service;


import com.dev.MyResuMate.DTO.LoginRequest;
import com.dev.MyResuMate.DTO.LoginResponse;
import com.dev.MyResuMate.DTO.SignupRequest;
import com.dev.MyResuMate.DTO.SignupResponse;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse("Login successful", true, user);
            } else {
                return new LoginResponse("Invalid password", false, null);
            }
        } else {
            return new LoginResponse("User not found", false, null);
        }
    }

    public SignupResponse signup(SignupRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return new SignupResponse("Email already in use", false, null);
        }

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // 🔐 TODO: hash later with BCrypt
                .premium(false)
                .build();

        User savedUser = userRepository.save(newUser);
        return new SignupResponse("Signup successful", true, savedUser);
    }
}
