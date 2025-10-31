package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class EducationDTO {
    private String degree;
    private String school;
    private String year; // Mapped from 'graduationYear'
    private String gpa;
}