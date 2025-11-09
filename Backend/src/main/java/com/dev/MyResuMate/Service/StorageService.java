package com.dev.MyResuMate.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils; // You may need to add this import

@Service
public class StorageService {

    // 1. This will be injected from application.properties
    private final Path rootLocation;

    @Autowired // ✅ Add this constructor
    public StorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);

        // 2. Create the directory if it doesn't exist
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    public String save(MultipartFile file) {
        if (file.isEmpty()) {
            return null; // No file uploaded
        }

        try {
            // 3. Create a unique filename (e.g., "a1b2c3d4.png")
            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            String uniqueFilename = UUID.randomUUID().toString() + "." + extension;

            // 4. Resolve the full destination path
            Path destinationFile = this.rootLocation.resolve(uniqueFilename)
                    .toAbsolutePath();

            // 5. Save the file
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // 6. Return the WEB-ACCESSIBLE path (as you requested)
            return "/uploads/" + uniqueFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }
}