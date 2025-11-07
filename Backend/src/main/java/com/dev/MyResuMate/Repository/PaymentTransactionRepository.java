package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional; // Import this

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Long> {

    // ✅ This is the method you were missing.
    // The service logic uses this to find the transaction
    // after Razorpay creates the order.
    Optional<PaymentTransaction> findByRazorpayOrderId(String orderId);
}