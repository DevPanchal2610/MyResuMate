package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.AdminDashboardDTO;
import com.dev.MyResuMate.Model.PaymentTransaction;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired private UserRepository userRepository;
    @Autowired private ResumeRepository resumeRepository;
    @Autowired private UserSubscriptionRepository subscriptionRepository;
    @Autowired private PaymentTransactionRepository transactionRepository;

    public AdminDashboardDTO getDashboardData(String range) {
        AdminDashboardDTO dto = new AdminDashboardDTO();

        // === 1. GET DATE RANGE ===
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate;
        String dateRangeLabel;

        switch (range) {
            case "30d":
                startDate = endDate.minusDays(30);
                dateRangeLabel = "Last 30 Days";
                break;
            case "90d":
                startDate = endDate.minusDays(90);
                dateRangeLabel = "Last 90 Days";
                break;
            case "7d":
            default:
                startDate = endDate.minusDays(7);
                dateRangeLabel = "Last 7 Days";
                break;
        }
        dto.setDateRangeLabel(dateRangeLabel);

        // === 2. GET STATS FOR THE DATE RANGE ===
        BigDecimal revenue = transactionRepository.sumTotalRevenueBetweenDates(startDate, endDate);
        dto.setTotalRevenueForRange(revenue != null ? revenue : BigDecimal.ZERO);
        dto.setNewUsersForRange(userRepository.countByRoleNotAndCreatedAtBetween("ADMIN", startDate, endDate));
        dto.setNewSubscriptionsForRange(subscriptionRepository.countBySubscriptionStatusAndStartDateBetween("ACTIVE", startDate, endDate));

        // === 3. GET ALL-TIME STATS ===
        dto.setTotalUsersAllTime(userRepository.countByRoleNot("ADMIN"));
        dto.setActiveSubscriptionsAllTime(subscriptionRepository.countBySubscriptionStatus("ACTIVE"));
        dto.setTotalResumesAllTime(resumeRepository.count());

        // === 4. GET ALL-TIME LISTS FOR TABLES ===
        dto.setRecentUsers(userRepository.findTop5ByRoleNotOrderByCreatedAtDesc("ADMIN"));
        dto.setRecentTransactions(transactionRepository.findTop5ByPaymentStatusOrderByPaymentDateDesc("SUCCESSFUL"));

        // === 5. GET CHART DATA FOR THE DATE RANGE ===
        List<RevenueProjection> revenueData = transactionRepository.findRevenueBetweenDates(startDate, endDate);
        Map<LocalDate, BigDecimal> revenueMap = revenueData.stream()
                .collect(Collectors.toMap(RevenueProjection::getDate, RevenueProjection::getTotal));

        List<String> labels = new ArrayList<>();
        List<BigDecimal> data = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        long daysBetween = ChronoUnit.DAYS.between(startDate.toLocalDate(), endDate.toLocalDate());

        for (long i = daysBetween - 1; i >= 0; i--) {
            LocalDate date = endDate.toLocalDate().minusDays(i);
            labels.add(date.format(formatter));
            data.add(revenueMap.getOrDefault(date, BigDecimal.ZERO));
        }

        dto.setChartLabels(labels);
        dto.setChartData(data);

        return dto;
    }
}