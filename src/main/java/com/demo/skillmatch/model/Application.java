package com.demo.skillmatch.model;



import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

    @Entity
    @Table(name = "applications")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Application {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "seeker_id")
        private User seeker;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "job_id")
        private JobPosting job;

        private LocalDateTime appliedAt;

        // PENDING, SEEN, ACCEPTED, REJECTED
        private String status = "PENDING";

        @PrePersist
        public void prePersist() {
            this.appliedAt = LocalDateTime.now();
        }
    }

