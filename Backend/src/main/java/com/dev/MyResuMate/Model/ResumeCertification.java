package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "resume_certifications")
@Data
public class ResumeCertification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    private String certificationName; // Mapped from 'name'
    private String issuer;
    private String dateObtained; // Mapped from 'date'
    private int displayOrder;
}