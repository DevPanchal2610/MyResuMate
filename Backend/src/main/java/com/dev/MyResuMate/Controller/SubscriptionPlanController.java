package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.PlanDto;
import com.dev.MyResuMate.Service.SubscriptionPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
//@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionPlanController {
    @Autowired
    private SubscriptionPlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanDto>> getPlans() {
        return ResponseEntity.ok(planService.getActivePlans());
    }
}
