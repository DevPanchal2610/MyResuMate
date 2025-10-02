package com.dev.MyResuMate.DTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
public record ContactInfo(String name, String email, String phone, String location, String linkedin, String github) {}