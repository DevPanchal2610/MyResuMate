package com.dev.MyResuMate.DTO;

import com.dev.MyResuMate.Model.PaymentTransaction;
import com.dev.MyResuMate.Model.User;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class AdminDashboardDTO {

    // --- Stats for Date Range ---
    private BigDecimal totalRevenueForRange = BigDecimal.ZERO;
    private long newUsersForRange = 0;
    private long newSubscriptionsForRange = 0;
    private String dateRangeLabel;

    // --- All-Time Stats ---
    private long totalUsersAllTime;
    private long activeSubscriptionsAllTime;
    private long totalResumesAllTime;

    // --- Chart Data ---
    private List<String> chartLabels = new ArrayList<>();
    private List<BigDecimal> chartData = new ArrayList<>();

    // --- Table Data ---
    private List<User> recentUsers;
    private List<PaymentTransaction> recentTransactions;
}