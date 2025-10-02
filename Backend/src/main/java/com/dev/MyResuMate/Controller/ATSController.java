package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.Service.ATSService;
import com.dev.MyResuMate.DTO.AtsAnalysisResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ats")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class ATSController {

    @Autowired
    private ATSService atsService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            AtsAnalysisResult result = atsService.analyzeResume(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // Good for debugging
            return ResponseEntity.status(500).body("Error analyzing resume: " + e.getMessage());
        }
    }
}