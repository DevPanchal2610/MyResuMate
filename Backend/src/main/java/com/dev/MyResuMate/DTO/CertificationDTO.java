package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class CertificationDTO {
    private String name; // Mapped from 'certificationName'
    private String issuer;
    private String date; // Mapped from 'dateObtained'
}