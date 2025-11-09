package com.dev.MyResuMate.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This line maps web requests for /uploads/**...
        registry.addResourceHandler("/uploads/**")
                // ...to the physical files in your external folder.
                // "file:" is critical.
                .addResourceLocations("file:" + uploadDir);
    }
}