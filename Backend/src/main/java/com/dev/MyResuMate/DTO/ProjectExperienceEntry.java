package com.dev.MyResuMate.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
public record ProjectExperienceEntry(String title, String organization, List<String> description, List<String> tool_stack) {}
