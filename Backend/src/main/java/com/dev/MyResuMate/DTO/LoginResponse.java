package com.dev.MyResuMate.DTO;

import com.dev.MyResuMate.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String message;
    private boolean success;
    private User user;      // pura user object, password hide kar sakte ho frontend me
    private String token;   // JWT token
}
