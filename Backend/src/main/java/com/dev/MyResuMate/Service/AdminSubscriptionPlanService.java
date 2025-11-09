package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.Model.SubscriptionPlan;
import com.dev.MyResuMate.Repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminSubscriptionPlanService {

    @Autowired
    private SubscriptionPlanRepository planRepository;

    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAllByOrderByIdAsc();
    }

    public SubscriptionPlan findById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription Plan not found with id: " + id));
    }

    @Transactional
    public void savePlan(SubscriptionPlan plan) {
        // This will update an existing plan if id is present,
        // or create a new one if id is null.
        planRepository.save(plan);
    }
}