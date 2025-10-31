package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.ResumeCardDTO;
import com.dev.MyResuMate.DTO.ResumeDataDTO;
import com.dev.MyResuMate.DTO.ResumeFullDTO;
import com.dev.MyResuMate.Model.Resume;
import com.dev.MyResuMate.Service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/save")
    public ResponseEntity<?> saveResume(@RequestBody ResumeDataDTO resumeData, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        try {
            String userEmail = principal.getName();
            Resume savedResume = resumeService.saveOrUpdateResume(resumeData, userEmail);
            return ResponseEntity.ok(savedResume);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-resumes")
    public ResponseEntity<?> getUserResumes(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            List<ResumeCardDTO> resumes = resumeService.getResumesForUser(principal.getName());
            return ResponseEntity.ok(resumes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getResumeById(@PathVariable Long resumeId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            ResumeFullDTO resumeDTO = resumeService.getResumeById(resumeId, principal.getName());
            return ResponseEntity.ok(resumeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage()); // 403 Forbidden if not owner
        }
    }
}