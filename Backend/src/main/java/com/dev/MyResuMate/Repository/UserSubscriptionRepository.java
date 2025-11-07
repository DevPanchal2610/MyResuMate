package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional; // Import this

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription,Long> {

    // ✅ This is the other method you were missing.
    // The service logic uses this to find a user's existing subscription
    // so it can be updated (instead of creating a new one).
    Optional<UserSubscription> findByUserId(Long userId);
}