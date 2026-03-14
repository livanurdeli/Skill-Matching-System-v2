package com.demo.skillmatch;

import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.Skill;
import com.demo.skillmatch.repository.JobPostingRepository;
import com.demo.skillmatch.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.List;

@SpringBootApplication
public class SkillmatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillmatchApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(SkillRepository skillRepository,
                               JobPostingRepository jobPostingRepository) {
        return args -> {

                if (skillRepository.count() == 0) {

                    Skill java   = skillRepository.save(new Skill(null, "Java", "Backend"));
                    Skill python = skillRepository.save(new Skill(null, "Python", "Backend"));
                    Skill js     = skillRepository.save(new Skill(null, "JavaScript", "Frontend"));
                    Skill react  = skillRepository.save(new Skill(null, "React", "Frontend"));
                    Skill spring = skillRepository.save(new Skill(null, "Spring Boot", "Backend"));
                    Skill docker = skillRepository.save(new Skill(null, "Docker", "DevOps"));
                    Skill sql    = skillRepository.save(new Skill(null, "SQL", "Database"));
                    Skill git    = skillRepository.save(new Skill(null, "Git", "DevOps"));
                    Skill html   = skillRepository.save(new Skill(null, "HTML", "Frontend"));
                    Skill css    = skillRepository.save(new Skill(null, "CSS", "Frontend"));
                    Skill aws    = skillRepository.save(new Skill(null, "AWS", "Cloud"));
                    Skill node   = skillRepository.save(new Skill(null, "Node.js", "Backend"));

                    jobPostingRepository.save(new JobPosting(null,
                            "Backend Developer",
                            "Java ve Spring Boot deneyimi aranıyor.",
                            "TechCorp",
                            "İstanbul",
                            List.of(java, spring, sql, git),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Frontend Developer",
                            "React ile modern UI geliştirme.",
                            "WebStudio",
                            "Ankara",
                            List.of(js, react, html, css, git),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "DevOps Engineer",
                            "Docker ve CI/CD pipeline deneyimi.",
                            "CloudBase",
                            "Remote",
                            List.of(docker, git, aws),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Full Stack Developer",
                            "Hem backend hem frontend bilen.",
                            "StartupX",
                            "İzmir",
                            List.of(java, spring, js, react, sql),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Python Developer",
                            "Python ile backend servis geliştirme.",
                            "DataSoft",
                            "İstanbul",
                            List.of(python, sql, git),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Node.js Developer",
                            "Node.js ile REST API geliştirme.",
                            "CodeHouse",
                            "Remote",
                            List.of(node, js, git),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Cloud Engineer",
                            "AWS ve Docker bilgisi.",
                            "SkyTech",
                            "Ankara",
                            List.of(aws, docker, python),
                            null));

                    jobPostingRepository.save(new JobPosting(null,
                            "Junior Web Developer",
                            "HTML, CSS ve JavaScript bilen.",
                            "WebStart",
                            "İzmir",
                            List.of(html, css, js),
                            null));
                }


        };
    }
}