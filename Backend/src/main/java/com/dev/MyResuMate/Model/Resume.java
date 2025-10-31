package com.dev.MyResuMate.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resumes")
@Data
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resumeTitle;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private ResumeTemplate template;

    private boolean isActive = true;
    private LocalDateTime lastEdited;
    private LocalDateTime createdAt;

    // ✅ This is the magic!
    // One resume has one personal info.
    // CascadeType.ALL: Save/Update/Delete personal info when the resume is.
    // orphanRemoval = true: Delete personal info from DB if it's removed from the resume.
    @OneToOne(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ResumePersonalInfo personalInfo;

    // One resume has many education entries.
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeEducation> education = new ArrayList<>();

    // One resume has many experience entries.
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeExperience> experience = new ArrayList<>();

    // ... and so on for all other lists
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeProject> projects = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeSkill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResumeCertification> certifications = new ArrayList<>();

    // Helper methods to keep both sides of the relationship in sync
    public void setPersonalInfo(ResumePersonalInfo personalInfo) {
        if (personalInfo != null) {
            personalInfo.setResume(this);
        }
        this.personalInfo = personalInfo;
    }

    public void setEducation(List<ResumeEducation> education) {
        this.education.clear();
        if (education != null) {
            education.forEach(edu -> edu.setResume(this));
            this.education.addAll(education);
        }
    }

    public void setExperience(List<ResumeExperience> experience) {
        this.experience.clear();
        if (experience != null) {
            experience.forEach(exp -> exp.setResume(this));
            this.experience.addAll(experience);
        }
    }

    public void setProjects(List<ResumeProject> projects) {
        this.projects.clear();
        if (projects != null) {
            projects.forEach(proj -> proj.setResume(this));
            this.projects.addAll(projects);
        }
    }

    public void setSkills(List<ResumeSkill> skills) {
        this.skills.clear();
        if (skills != null) {
            skills.forEach(skill -> skill.setResume(this));
            this.skills.addAll(skills);
        }
    }

    public void setCertifications(List<ResumeCertification> certifications) {
        this.certifications.clear();
        if (certifications != null) {
            certifications.forEach(cert -> cert.setResume(this));
            this.certifications.addAll(certifications);
        }
    }
}