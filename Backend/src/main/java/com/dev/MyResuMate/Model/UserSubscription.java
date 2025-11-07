package com.dev.MyResuMate.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne // A user has one active subscription
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id", referencedColumnName = "id")
    private SubscriptionPlan plan;

    private String billingCycle; // "MONTHLY" or "YEARLY"
    private String subscriptionStatus; // "ACTIVE", "INACTIVE", "CANCELLED"
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}