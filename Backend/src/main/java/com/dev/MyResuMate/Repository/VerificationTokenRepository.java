package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);
}
