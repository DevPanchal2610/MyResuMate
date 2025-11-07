package com.dev.MyResuMate.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserSubscriptionDto {
    private String planName;
    private String billingCycle;
    private String subscriptionStatus;
    private LocalDateTime endDate;
}