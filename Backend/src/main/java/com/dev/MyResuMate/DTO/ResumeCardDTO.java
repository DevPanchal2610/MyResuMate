package com.dev.MyResuMate.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCardDTO {
    private Long id;
    private String resumeTitle;
    private String templateName;
    private String templateKey;
    private LocalDateTime lastEdited;
}