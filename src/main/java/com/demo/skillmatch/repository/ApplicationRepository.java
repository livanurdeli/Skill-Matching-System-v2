package com.demo.skillmatch.repository;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Seekerin tüm başvuruları
    List<Application> findBySeeker(User seeker);

    // Bir ilana yapılan tüm başvurular
    List<Application> findByJob(JobPosting job);

    // Seeker bu ilana başvurmuş mu?
    boolean existsBySeekerAndJob(User seeker, JobPosting job);

    // İşverenin ilanlarına gelen tüm başvurular
    List<Application> findByJobIn(List<JobPosting> jobs);

    // PENDING başvuru sayısı (bildirim için)
    long countByJobInAndStatus(List<JobPosting> jobs, String status);
}