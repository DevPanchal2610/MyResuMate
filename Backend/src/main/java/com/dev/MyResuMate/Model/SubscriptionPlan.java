package com.dev.MyResuMate.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "plan_key")
    private String planKey;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "monthly_price")
    private BigDecimal monthlyPrice;

    @Column(name = "yearly_price")
    private BigDecimal yearlyPrice;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(name = "max_resumes")
    private Integer maxResumes;

    @Column(name = "max_templates")
    private Integer maxTemplates;

    @Column(name = "is_active")
    private boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}