package com.dev.MyResuMate.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private boolean verified = false; // default false

    @Column(name = "is_premium", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isPremium = false;

    @Column(nullable = false)
    private String role = "USER"; // Default role

    @Column(nullable = false)
    private boolean isActive = true; // Default to active

    @Column(name = "chat_prompt_count", nullable = false)
    private int chatPromptCount = 0;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private UserSubscription subscription;

}
