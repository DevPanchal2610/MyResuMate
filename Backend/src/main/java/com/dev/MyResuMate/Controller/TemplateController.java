package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.Model.ResumeTemplate;
import com.dev.MyResuMate.Repository.ResumeTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private ResumeTemplateRepository resumeTemplateRepository;

    @GetMapping
    public ResponseEntity<List<ResumeTemplate>> getAllTemplates() {
        // Find all active templates
        List<ResumeTemplate> templates = resumeTemplateRepository.findAll()
                .stream()
                .filter(ResumeTemplate::isActive)
                .toList();
        return ResponseEntity.ok(templates);
    }
}