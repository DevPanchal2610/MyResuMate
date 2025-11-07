package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.UserSubscriptionDto;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Repository.UserRepository;
import com.dev.MyResuMate.Service.UserSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions")
//@CrossOrigin(origins = "http://localhost:3000")
public class UserSubscriptionController {

    @Autowired
    private UserSubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-status")
    public ResponseEntity<?> getMySubscriptionStatus(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserSubscriptionDto> dto = subscriptionService.getActiveSubscription(user);

        if (dto.isPresent()) {
            return ResponseEntity.ok(dto.get());
        } else {
            // Return a specific object if no subscription is found
            return ResponseEntity.ok(new UserSubscriptionDto()); // Or return 404
        }
    }
}