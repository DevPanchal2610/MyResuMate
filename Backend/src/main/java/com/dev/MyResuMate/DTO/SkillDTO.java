package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class SkillDTO {
    private String category; // Mapped from 'skillCategory'
    private String items; // Mapped from 'skillsList'
}