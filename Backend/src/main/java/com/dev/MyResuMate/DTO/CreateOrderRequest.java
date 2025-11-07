package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Long planId;
    private String billingCycle; // "monthly" or "yearly"
}