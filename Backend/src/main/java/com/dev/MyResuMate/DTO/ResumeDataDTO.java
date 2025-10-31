package com.dev.MyResuMate.DTO;

import lombok.Data;
import java.util.List;

@Data
public class ResumeDataDTO {
    // We add these two fields from the frontend
    private Long resumeId; // Null if new, has value if updating
    private String resumeTitle;
    private String templateKey; // "modern", "professional", etc.

    // These objects map to your frontend state
    private PersonalInfoDTO personal;
    private List<EducationDTO> education;
    private List<ExperienceDTO> experience;
    private List<ProjectDTO> projects;
    private List<SkillDTO> skills;
    private List<CertificationDTO> certifications;
}