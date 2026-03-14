package com.demo.skillmatch.service;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    // Başvur
    public Application apply(User seeker, JobPosting job) {
        if (applicationRepository.existsBySeekerAndJob(seeker, job)) {
            return null; // zaten başvurmuş
        }
        Application app = new Application();
        app.setSeeker(seeker);
        app.setJob(job);
        app.setStatus("PENDING");
        return applicationRepository.save(app);
    }

    // Seekerin başvuruları
    public List<Application> findBySeeker(User seeker) {
        return applicationRepository.findBySeeker(seeker);
    }

    // Bir ilana gelen başvurular
    public List<Application> findByJob(JobPosting job) {
        return applicationRepository.findByJob(job);
    }

    // İşverenin tüm ilanlarına gelen başvurular
    public List<Application> findByJobs(List<JobPosting> jobs) {
        return applicationRepository.findByJobIn(jobs);
    }

    // Yeni (PENDING) başvuru sayısı
    public long countPending(List<JobPosting> jobs) {
        if (jobs.isEmpty()) return 0;
        return applicationRepository.countByJobInAndStatus(jobs, "PENDING");
    }

    // Başvuruyu gör (PENDING → SEEN)
    public void markSeen(Long applicationId) {
        applicationRepository.findById(applicationId).ifPresent(app -> {
            if ("PENDING".equals(app.getStatus())) {
                app.setStatus("SEEN");
                applicationRepository.save(app);
            }
        });
    }
}