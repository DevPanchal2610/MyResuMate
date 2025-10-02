package com.dev.MyResuMate.DTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public record Skills(List<String> backend, List<String> database, List<String> frontend, List<String> others, List<String> soft_skills, List<String> languages, List<String> operating_system) {}
