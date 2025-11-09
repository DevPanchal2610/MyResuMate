package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.ResumeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeTemplateRepository extends JpaRepository<ResumeTemplate, Long> {
    // This allows us to find a template by its string key (e.g., "modern")
    Optional<ResumeTemplate> findByTemplateKey(String templateKey);
    List<ResumeTemplate> findAllByOrderByIdAsc();
}