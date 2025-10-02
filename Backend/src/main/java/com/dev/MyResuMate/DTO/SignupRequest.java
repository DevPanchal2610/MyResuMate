package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
}

