package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.LoginRequest;
import com.dev.MyResuMate.DTO.LoginResponse;
import com.dev.MyResuMate.DTO.SignupRequest;
import com.dev.MyResuMate.DTO.SignupResponse;
import com.dev.MyResuMate.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UserController {

    @Autowired
    private UserService userService;

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
}
