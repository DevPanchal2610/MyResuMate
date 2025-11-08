package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.ResumeCardDTO;
import com.dev.MyResuMate.DTO.ResumeDataDTO;
import com.dev.MyResuMate.DTO.ResumeFullDTO;
import com.dev.MyResuMate.Model.Resume;
import com.dev.MyResuMate.Model.ResumeTemplate;
import com.dev.MyResuMate.Model.User;
import com.dev.MyResuMate.Repository.ResumeRepository;
import com.dev.MyResuMate.Repository.ResumeTemplateRepository;
import com.dev.MyResuMate.Repository.UserRepository;
import com.dev.MyResuMate.Util.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeTemplateRepository resumeTemplateRepository;

    @Autowired
    private ResumeMapper resumeMapper;

    @Transactional
    public Resume saveOrUpdateResume(ResumeDataDTO dto, String userEmail) {
        // 1. Find the User
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the Template
        ResumeTemplate template = resumeTemplateRepository.findByTemplateKey(dto.getTemplateKey())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        // 3. Find existing Resume or create a new one
        Resume resume;
        if (dto.getResumeId() != null) {
            // This is an update
            resume = resumeRepository.findById(dto.getResumeId())
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            // Security check: Make sure this resume belongs to the logged-in user
            if (!resume.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized to update this resume");
            }
        } else {
            // This is a new resume
            resume = new Resume();
            resume.setCreatedAt(LocalDateTime.now());
        }

        // 4. Set last edited time
        resume.setLastEdited(LocalDateTime.now());

        // 5. Map all DTO data to entities
        // This mapper will set the user, template, title, and all child lists
        resume = resumeMapper.mapDtoToEntity(dto, resume, user, template);

        // 6. Save the resume.
        // Thanks to CascadeType.ALL, this saves the resume AND all child entities
        // in one single, transactional operation.
        return resumeRepository.save(resume);
    }

    // ✅ ADD THIS METHOD
    public List<ResumeCardDTO> getResumesForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Resume> resumes = resumeRepository.findByUserOrderByLastEditedDesc(user);

        return resumes.stream()
                .map(resume -> new ResumeCardDTO(
                        resume.getId(),
                        resume.getResumeTitle(),
                        resume.getTemplate().getTemplateName(),
                        resume.getTemplate().getTemplateKey(),
                        resume.getLastEdited(),
                        resume.getDownloadCount()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true) // Good for performance
    public ResumeFullDTO getResumeById(Long resumeId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // ❗️ SECURITY CHECK
        if (!resume.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this resume");
        }

        return resumeMapper.mapEntityToFullDTO(resume);
    }

    @Transactional
    public void incrementDownloadCount(Long resumeId, User user) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Security check: Make sure the user owns this resume
        if (!resume.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User does not have permission to update this resume");
        }

        resume.setDownloadCount(resume.getDownloadCount() + 1);
        resumeRepository.save(resume);
    }
}