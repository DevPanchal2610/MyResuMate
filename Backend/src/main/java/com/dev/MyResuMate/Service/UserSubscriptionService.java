package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.UserSubscriptionDto;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Model.UserSubscription;
import com.dev.MyResuMate.Repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSubscriptionService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    public Optional<UserSubscriptionDto> getActiveSubscription(User user) {
        Optional<UserSubscription> subOpt = subscriptionRepository.findByUserId(user.getId());

        if (subOpt.isPresent()) {
            UserSubscription sub = subOpt.get();
            UserSubscriptionDto dto = new UserSubscriptionDto();
            dto.setPlanName(sub.getPlan().getPlanName());
            dto.setBillingCycle(sub.getBillingCycle());
            dto.setSubscriptionStatus(sub.getSubscriptionStatus());
            dto.setEndDate(sub.getEndDate());
            return Optional.of(dto);
        }
        return Optional.empty();
    }
}