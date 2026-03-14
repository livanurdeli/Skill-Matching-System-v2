package com.demo.skillmatch.repository;

import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByCreatedBy(User createdBy);
}
