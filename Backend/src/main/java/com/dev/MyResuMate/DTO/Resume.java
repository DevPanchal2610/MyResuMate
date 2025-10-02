package com.dev.MyResuMate.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Resume(
        ContactInfo contact_info,
        String profile_summary,
        List<EducationEntry> education,
        List<ProjectExperienceEntry> projects,
        List<ProjectExperienceEntry> work_experience,
        Skills skills,
        List<String> hobbies_and_interests
) {}