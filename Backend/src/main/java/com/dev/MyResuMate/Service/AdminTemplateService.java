package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.Model.ResumeTemplate;
import com.dev.MyResuMate.Repository.ResumeTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AdminTemplateService {

    @Autowired
    private ResumeTemplateRepository templateRepository;

    @Autowired
    private StorageService storageService;

    public List<ResumeTemplate> getAllTemplates() {
        return templateRepository.findAllByOrderByIdAsc();
    }

    public ResumeTemplate findById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
    }

    @Transactional
    public void saveTemplate(ResumeTemplate template, MultipartFile imageFile) {
        // 1. Check if a new file was uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            // 2. Save the new file and get its path
            String imagePath = storageService.save(imageFile);

            // 3. Set the new path on the template object
            // This is the path like "/uploads/image.png"
            template.setPreviewImageUrl(imagePath);
        } else {
            // 4. If no new file, and it's a new template, set a default
            if (template.getId() == null) {
                template.setPreviewImageUrl("/default-preview.png"); // A fallback
            }
            // If it's an *update* and no file is sent,
            // the 'previewImageUrl' field from the hidden input will be used,
            // preserving the old image.
        }

        // 5. Save the template to the DB
        templateRepository.save(template);
    }

    @Transactional
    public void deleteTemplate(Long id) {
        // You can add more logic here later, like checking
        // if any resumes are using this template before deleting.
        templateRepository.deleteById(id);
    }
}