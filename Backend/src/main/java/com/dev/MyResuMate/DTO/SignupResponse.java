package com.dev.MyResuMate.DTO;

import com.dev.MyResuMate.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponse {
    private String message;
    private boolean success;
    private User user;
}
