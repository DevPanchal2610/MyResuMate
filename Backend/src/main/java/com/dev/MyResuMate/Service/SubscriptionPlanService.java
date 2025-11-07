package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.PlanDto;
import com.dev.MyResuMate.Model.SubscriptionPlan;
import com.dev.MyResuMate.Repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;


@Service
public class SubscriptionPlanService {
    @Autowired
    private SubscriptionPlanRepository planRepository;

    public List<PlanDto> getActivePlans() {
        // Fetch only the plans you want to show
        List<SubscriptionPlan> plans = planRepository.findByPlanKeyIn(List.of("FREE", "PREMIUM"));

        // Convert to DTOs
        return plans.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private PlanDto convertToDto(SubscriptionPlan plan) {
        PlanDto dto = new PlanDto();
        dto.setId(plan.getId());
        dto.setName(plan.getPlanName());
        dto.setPlanKey(plan.getPlanKey());
        dto.setDescription(plan.getDescription());
        dto.setMonthlyPrice(plan.getMonthlyPrice());
        dto.setYearlyPrice(plan.getYearlyPrice());
        // Split the comma-separated features string into a list
        if (plan.getFeatures() != null && !plan.getFeatures().isEmpty()) {
            // 1. Remove brackets, quotes, and leading/trailing spaces
            String cleanedFeatures = plan.getFeatures()
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\"", "")
                    .trim();

            // 2. Split by comma and trim each item
            dto.setFeatures(
                    Arrays.stream(cleanedFeatures.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList())
            );
        } else {
            dto.setFeatures(List.of());
        }
        return dto;
    }
}