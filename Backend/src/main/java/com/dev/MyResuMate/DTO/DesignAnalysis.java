package com.dev.MyResuMate.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DesignAnalysis(
        int image_count,
        boolean has_photo,
        int font_count,  // <-- This is the missing field
        List<String> fonts,
        boolean uses_columns_or_tables
) {}