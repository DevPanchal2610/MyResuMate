package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.Model.UserSubscription;
import com.dev.MyResuMate.Repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserSubscriptionService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    public List<UserSubscription> getAllSubscriptions() {
        return subscriptionRepository.findAllByOrderByIdAsc();
    }
}