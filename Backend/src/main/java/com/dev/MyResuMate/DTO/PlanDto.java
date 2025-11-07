package com.dev.MyResuMate.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PlanDto {
    private Long id;
    private String name;
    private String planKey;
    private String description;
    private BigDecimal monthlyPrice;
    private BigDecimal yearlyPrice;
    private List<String> features; // We'll send features as a list
}