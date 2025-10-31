package com.dev.MyResuMate.DTO;

import lombok.Data;

@Data
public class ProjectDTO {
    private String name; // Mapped from 'projectName'
    private String description;
    private String technologies;
    private String url; // Mapped from 'projectUrl'
}