package com.dev.MyResuMate.Repository;

import com.dev.MyResuMate.Model.Resume;
import com.dev.MyResuMate.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByLastEditedDesc(User user);
}