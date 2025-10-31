package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "resume_personal_info")
@Data
public class ResumePersonalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore // Prevents infinite loops in JSON
    private Resume resume;

    private String firstName;
    private String lastName;
    private String professionalTitle;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedin;
    private String github;
    @Column(columnDefinition = "TEXT")
    private String professionalSummary;
}