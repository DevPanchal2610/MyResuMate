package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private Long planId;
    private String billingCycle;
}