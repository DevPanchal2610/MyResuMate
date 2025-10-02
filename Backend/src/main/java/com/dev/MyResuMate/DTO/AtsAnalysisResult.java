package com.dev.MyResuMate.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AtsAnalysisResult(
        Resume content,
        DesignAnalysis design,
        int atsScore,
        List<FeedbackItem> feedbackItems, // The new detailed feedback list
        List<String> aiSuggestions       // The high-level suggestions from Gemini
) {}