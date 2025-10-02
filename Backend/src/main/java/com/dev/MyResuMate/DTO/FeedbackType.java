package com.dev.MyResuMate.DTO;

public enum FeedbackType {
    CRITICAL_ISSUE, // Red - Things that will likely get the resume rejected by an ATS.
    IMPROVEMENT,    // Yellow - Suggestions for making the resume stronger.
    GOOD_PRACTICE   // Green - Things the user did well.
}