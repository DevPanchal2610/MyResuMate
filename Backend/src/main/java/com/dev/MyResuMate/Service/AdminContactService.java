package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.Model.ContactSubmission;
import com.dev.MyResuMate.Repository.ContactSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminContactService {

    @Autowired
    private ContactSubmissionRepository contactRepository;

    public List<ContactSubmission> getAllSubmissions() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }
}