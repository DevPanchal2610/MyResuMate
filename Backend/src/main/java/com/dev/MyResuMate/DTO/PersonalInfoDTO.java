package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class PersonalInfoDTO {
    private String firstName;
    private String lastName;
    private String title; // Mapped from 'professionalTitle'
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedin;
    private String github;
    private String summary; // Mapped from 'professionalSummary'
}