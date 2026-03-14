package com.demo.skillmatch.repository;
import com.demo.skillmatch.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategory(String category);
}