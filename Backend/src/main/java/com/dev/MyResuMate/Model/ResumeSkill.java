package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "resume_skills")
@Data
public class ResumeSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    private String skillCategory;
    @Column(columnDefinition = "TEXT")
    private String skillsList; // Mapped from 'items' in frontend
    private int displayOrder;
}