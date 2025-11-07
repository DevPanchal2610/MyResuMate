package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.ContactSubmissionDto;
import com.dev.MyResuMate.Service.ContactSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
//@CrossOrigin(origins = "http://localhost:3000") // Adjust port if your React app is different
public class ContactSubmissionController {

    @Autowired
    private ContactSubmissionService contactService;

    @PostMapping("/submit")
    public ResponseEntity<?> handleSubmitSubmission(@RequestBody ContactSubmissionDto submissionDto) {
        try {
            contactService.saveSubmission(submissionDto);
            // Return a simple JSON response
            return ResponseEntity.ok().body("{\"message\": \"Submission received successfully!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"An error occurred while processing your request.\"}");
        }
    }
}