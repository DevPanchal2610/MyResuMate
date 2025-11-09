package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    // Find plans by keys so we can ignore "PROFESSIONAL"
    List<SubscriptionPlan> findByPlanKeyIn(List<String> planKeys);
    List<SubscriptionPlan> findAllByOrderByIdAsc();
}
