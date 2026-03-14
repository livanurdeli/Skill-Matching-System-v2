package com.demo.skillmatch.service;
import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.Skill;
import com.demo.skillmatch.model.User;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    public double calculateMatch(User user, JobPosting job) {
        List<Skill> requiredSkills = job.getRequiredSkills();

        if (requiredSkills == null || requiredSkills.isEmpty()) return 0;

        Set<Long> userSkillIds = user.getSkills()
                .stream()
                .map(Skill::getId)
                .collect(Collectors.toSet());

        long matchCount = requiredSkills.stream()
                .filter(s -> userSkillIds.contains(s.getId()))
                .count();

        double score = ((double) matchCount / requiredSkills.size()) * 100;

        // 2 ondalık basamağa yuvarla
        return Math.round(score * 100.0) / 100.0;
    }
}
