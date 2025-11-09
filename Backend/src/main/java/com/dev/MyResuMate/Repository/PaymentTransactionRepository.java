package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional; // Import this

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Long> {

    // ✅ This is the method you were missing.
    // The service logic uses this to find the transaction
    // after Razorpay creates the order.
    Optional<PaymentTransaction> findByRazorpayOrderId(String orderId);
    List<PaymentTransaction> findTop5ByPaymentStatusOrderByPaymentDateDesc(String status);

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.paymentStatus = 'SUCCESSFUL'")
    BigDecimal sumTotalRevenue();

    @Query(value = "SELECT DATE(payment_date) as date, SUM(amount) as total " +
            "FROM payment_transactions " +
            "WHERE payment_status = 'SUCCESSFUL' AND payment_date >= CURDATE() - INTERVAL 7 DAY " +
            "GROUP BY DATE(payment_date) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<RevenueProjection> findRevenueOverLast7Days();

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.paymentStatus = 'SUCCESSFUL' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT DATE(payment_date) as date, SUM(amount) as total " +
            "FROM payment_transactions " +
            "WHERE payment_status = 'SUCCESSFUL' AND payment_date BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(payment_date) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<RevenueProjection> findRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}