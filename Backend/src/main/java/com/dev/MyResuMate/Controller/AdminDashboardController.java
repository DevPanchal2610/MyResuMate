package com.dev.MyResuMate.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminDashboardController {

    @GetMapping("/dashboard")
    public String getDashboard(Model model, Authentication authentication) {
        // 'authentication' is automatically injected by Spring Security
        // because we are in a stateful session.
        String adminName = authentication.getName(); // This will be the admin's email

        model.addAttribute("adminName", adminName);

        // This tells Spring to look for "dashboard.html" inside "src/main/resources/templates/admin/"
        return "admin/dashboard";
    }
}