package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.CreateOrderRequest;
import com.dev.MyResuMate.DTO.VerifyPaymentRequest;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Repository.UserRepository;
import com.dev.MyResuMate.Service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
//@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository; // To get the logged-in user

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        // Get logged-in user (ensure Spring Security is configured)
        String username = authentication.getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Order order = paymentService.createOrder(user, request.getPlanId(), request.getBillingCycle());

            JSONObject response = new JSONObject();
            response.put("razorpay_order_id", (String) order.get("id"));
            response.put("amount", (Integer) order.get("amount")); // Amount in paisa
            response.put("currency", "INR");
            response.put("razorpay_key_id", razorpayKeyId);
            response.put("user_name", user.getName());
            response.put("user_email", user.getEmail());
            // Add user's phone if you have it

            return ResponseEntity.ok(response.toString());

        } catch (Exception e) { // ✅ CHANGED from RazorpayException to Exception
            e.printStackTrace();
            // ✅ UPDATED to send a clearer JSON error
            return ResponseEntity.status(500).body("{\"message\": \"Error creating Razorpay order: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isSuccess = paymentService.verifyPaymentAndUpdateSubscription(user, request);

        if (isSuccess) {
            return ResponseEntity.ok("{\"message\": \"Payment successful and subscription activated!\"}");
        } else {
            return ResponseEntity.status(400).body("{\"message\": \"Payment verification failed!\"}");
        }
    }
}