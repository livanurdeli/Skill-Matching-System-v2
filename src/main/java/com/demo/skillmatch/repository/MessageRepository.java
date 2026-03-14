package com.demo.skillmatch.repository;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.Message;
import com.demo.skillmatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByApplicationOrderBySentAtAsc(Application application);
    // Kullanıcıya gelen okunmamış mesajlar
    @Query("SELECT COUNT(m) FROM Message m WHERE m.application.seeker = :user AND m.sender != :user AND m.isRead = false")
    long countUnreadForSeeker(@Param("user") User user);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.application.job.createdBy = :user AND m.sender != :user AND m.isRead = false")
    long countUnreadForEmployer(@Param("user") User user);
    @Query("SELECT m.application FROM Message m WHERE m.application.seeker = :user AND m.sender != :user AND m.isRead = false ORDER BY m.sentAt DESC")
    List<Application> findUnreadApplicationsForSeeker(@Param("user") User user);

    @Query("SELECT m.application FROM Message m WHERE m.application.job.createdBy = :user AND m.sender != :user AND m.isRead = false ORDER BY m.sentAt DESC")
    List<Application> findUnreadApplicationsForEmployer(@Param("user") User user);
}