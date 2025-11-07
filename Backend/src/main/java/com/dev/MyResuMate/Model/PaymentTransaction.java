package com.dev.MyResuMate.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // Link transaction to the subscription it created/renewed
    @OneToOne
    @JoinColumn(name = "subscription_id")
    private UserSubscription subscription;

    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String paymentStatus; // e.g., "CREATED", "SUCCESSFUL", "FAILED"
    private String paymentGateway;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
}