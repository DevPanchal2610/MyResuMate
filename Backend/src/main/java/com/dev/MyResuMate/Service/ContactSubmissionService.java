package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.ContactSubmissionDto;
import com.dev.MyResuMate.Model.ContactSubmission;
import com.dev.MyResuMate.Model.User; // Make sure this is your User entity
import com.dev.MyResuMate.Repository.ContactSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactSubmissionService {

    @Autowired
    private ContactSubmissionRepository submissionRepository;

    @Autowired
    private EmailService emailService; // Your existing service

    @Transactional
    public void saveSubmission(ContactSubmissionDto dto) {
        // 1. Create the entity to save
        ContactSubmission submission = new ContactSubmission();
        submission.setName(dto.getName());
        submission.setEmail(dto.getEmail());
        submission.setSubject(dto.getSubject());
        submission.setMessage(dto.getMessage());
        submission.setCategory(dto.getCategory());

        // 2. Check for a logged-in user
        // This works even on a public endpoint, as the Spring Security filter chain
        // will still populate the context if a valid token is provided.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof User) {
            User loggedInUser = (User) authentication.getPrincipal();
            submission.setUserId(loggedInUser.getId());
        }
        // If no user is logged in, userId remains null, which is correct.

        // 3. Save to database
        ContactSubmission savedSubmission = submissionRepository.save(submission);

        // 4. Send the confirmation email
        String emailSubject = "We've received your message (Ref: #" + savedSubmission.getId() + ")";
        String emailBody = String.format(
                "Hello %s,\n\n" +
                        "Thank you for contacting MyResuMate!\n\n" +
                        "We have received your message and a member of our team will get back to you shortly.\n\n" +
                        "Your inquiry details:\n" +
                        "Subject: %s\n" +
                        "Category: %s\n\n" +
                        "Best regards,\n" +
                        "The MyResuMate Team",
                dto.getName(), dto.getSubject(), dto.getCategory()
        );

        emailService.sendEmail(dto.getEmail(), emailSubject, emailBody);
    }
}