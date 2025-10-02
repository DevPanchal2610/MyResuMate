package com.dev.MyResuMate.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
public record EducationEntry(String institution, String degree, String dates, String details) {}
