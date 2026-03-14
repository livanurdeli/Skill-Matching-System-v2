package com.demo.skillmatch.service;
import com.demo.skillmatch.model.Skill;
import com.demo.skillmatch.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> findAll() {
        return skillRepository.findAll();
    }

    public List<Skill> findByCategory(String category) {
        return skillRepository.findByCategory(category);
    }

    public Skill save(Skill skill) {
        return skillRepository.save(skill);
    }
}