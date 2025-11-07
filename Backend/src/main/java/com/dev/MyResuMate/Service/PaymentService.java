package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.Model.*;
import com.dev.MyResuMate.Repository.*;
import com.dev.MyResuMate.DTO.VerifyPaymentRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentTransactionRepository transactionRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // ✅ UPDATED createOrder method
    @Transactional
    public Order createOrder(User user, Long planId, String billingCycle) throws RazorpayException {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        BigDecimal price = billingCycle.equalsIgnoreCase("monthly") ? plan.getMonthlyPrice() : plan.getYearlyPrice();

        // Convert to smallest currency unit (e.g., Rupees to Paisa)
        BigDecimal amountInPaisa = price.multiply(new BigDecimal("100"));

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaisa.longValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_user_" + user.getId() + "_plan_" + plan.getId());

        // 1. Create the Razorpay Order
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // 2. We NO LONGER save a "pending" transaction.
        // This completely avoids all 'cannot be null' errors.

        return razorpayOrder;
    }

    // ✅ UPDATED verifyPayment method
    @Transactional
    public boolean verifyPaymentAndUpdateSubscription(User user, VerifyPaymentRequest request) {
        try {
            // 1. Verify Signature
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (!isValid) {
                return false; // Signature mismatch!
            }

            // 2. Find the plan
            SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan not found"));

            // 3. Create or Update UserSubscription
            UserSubscription subscription = subscriptionRepository.findByUserId(user.getId())
                    .orElse(new UserSubscription()); // Get existing or create new

            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setBillingCycle(request.getBillingCycle().toUpperCase());
            subscription.setSubscriptionStatus("ACTIVE");
            subscription.setStartDate(LocalDateTime.now());

            if (request.getBillingCycle().equalsIgnoreCase("monthly")) {
                subscription.setEndDate(LocalDateTime.now().plusMonths(1));
            } else {
                subscription.setEndDate(LocalDateTime.now().plusYears(1));
            }
            subscription.setUpdatedAt(LocalDateTime.now());
            if(subscription.getCreatedAt() == null) subscription.setCreatedAt(LocalDateTime.now());

            // 4. Save the subscription FIRST
            UserSubscription savedSubscription = subscriptionRepository.save(subscription);

            // 5. NOW create and save the COMPLETED transaction
            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setUser(user);
            transaction.setSubscription(savedSubscription); // ✅ We now have a valid subscription_id
            transaction.setRazorpayOrderId(request.getRazorpayOrderId());
            transaction.setRazorpayPaymentId(request.getRazorpayPaymentId()); // ✅ We now have a valid payment_id
            transaction.setRazorpaySignature(request.getRazorpaySignature());
            transaction.setPaymentStatus("SUCCESSFUL");
            transaction.setPaymentGateway("RAZORPAY");
            transaction.setPaymentDate(LocalDateTime.now());

            // Set amount from the plan
            BigDecimal price = request.getBillingCycle().equalsIgnoreCase("monthly") ? plan.getMonthlyPrice() : plan.getYearlyPrice();
            transaction.setAmount(price);
            transaction.setCurrency("INR");

            transactionRepository.save(transaction); // This will now succeed

            // 6. Update User
            user.setPremium(true);
            user.setSubscription(savedSubscription);
            userRepository.save(user);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}