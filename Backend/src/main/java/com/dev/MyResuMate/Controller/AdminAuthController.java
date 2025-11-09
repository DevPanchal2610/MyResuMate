package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.Security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class AdminAuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService; // This is your UserService

    @GetMapping("/admin-auth")
    public RedirectView authenticateAdmin(@RequestParam String token, HttpServletRequest request) {
        try {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // Check if the user is actually an ADMIN
                boolean isAdmin = userDetails.getAuthorities().stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));

                if (isAdmin) {
                    // Manually create an Authentication object
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // Set the authentication in the SecurityContext
                    SecurityContext sc = SecurityContextHolder.getContext();
                    sc.setAuthentication(auth);

                    // ✅ This is the magic: create a new session and save the context
                    HttpSession session = request.getSession(true);
                    session.setAttribute("SPRING_SECURITY_CONTEXT", sc);

                    // Redirect to the admin dashboard
                    return new RedirectView("/admin/dashboard");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // If anything fails (bad token, not an admin), redirect to home with an error
        return new RedirectView("http://localhost:3000/auth?error=admin_login_failed");
    }
}