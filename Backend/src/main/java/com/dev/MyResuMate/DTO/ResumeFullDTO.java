package com.dev.MyResuMate.DTO;

import lombok.Data;
import java.util.List;

// This DTO mirrors the frontend's 'resumeData' state
@Data
public class ResumeFullDTO {
    private Long resumeId;
    private String resumeTitle;
    private String templateKey;

    private PersonalInfoDTO personal;
    private List<EducationDTO> education;
    private List<ExperienceDTO> experience;
    private List<ProjectDTO> projects;
    private List<SkillDTO> skills;
    private List<CertificationDTO> certifications;
}