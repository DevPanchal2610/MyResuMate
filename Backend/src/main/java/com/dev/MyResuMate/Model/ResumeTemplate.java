package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
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

    @JsonProperty("isPremium")
    private boolean isPremium;

    @Column(name = "is_active") // Explicitly map to the snake_case column
    private boolean isActive;

    private double rating;
    private int downloadCount;
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String htmlTemplate;

    @Column(columnDefinition = "TEXT")
    private String cssStyles;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}