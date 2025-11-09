package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_templates")
@Data
public class ResumeTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String templateName;

    @Column(unique = true, nullable = false)
    private String templateKey; // 'modern', 'professional'

    private String description;
    private String previewImageUrl;
    private String category;

    @Column(name = "is_premium") // Keep DB column name
    @JsonProperty("isPremium")   // Keep JSON name for React
    private boolean premium; // Renamed from isPremium

    @Column(name = "is_active")
    @JsonProperty("isActive")    // Keep JSON name for React
    private boolean active;

    private double rating;
    private int downloadCount;
    private String tags;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}