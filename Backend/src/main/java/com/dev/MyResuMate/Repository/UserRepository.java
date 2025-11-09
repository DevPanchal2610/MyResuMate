package com.dev.MyResuMate.Repository;


import com.dev.MyResuMate.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findTop5ByOrderByCreatedAtDesc();
    // This will find all users WHERE the role is NOT 'ADMIN', ordered by ID
    List<User> findByRoleNotOrderByIdAsc(String role);
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
