package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String token;
    private String newPassword;
}