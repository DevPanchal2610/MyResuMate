package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class ContactSubmissionDto {
    // These fields must match the 'name' attributes in your React form
    private String name;
    private String email;
    private String subject;
    private String message;
    private String category;
}