package com.demo.skillmatch.repository;

import com.demo.skillmatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    // UserRepository'ye ekle
    List<User> findByRole(String role);
}