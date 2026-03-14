package com.demo.skillmatch.controller;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.Skill;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.service.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("/employer")
@RequiredArgsConstructor
public class EmployerController {

    private final JobPostingService  jobPostingService;
    private final MatchingService    matchingService;
    private final SkillService       skillService;
    private final UserService        userService;
    private final ApplicationService applicationService;

    private User getEmployer(HttpSession session) {
        User u = (User) session.getAttribute("loggedUser");
        if (u == null || !"EMPLOYER".equalsIgnoreCase(u.getRole())) return null;
        return userService.findByIdOrNull(u.getId());
    }

    @GetMapping("/home")
    public String dashboard(HttpSession session, Model model) {

        User employer = getEmployer(session);
        if (employer == null) return "redirect:/login";

        List<JobPosting> myJobs = jobPostingService.findByEmployer(employer);

        List<Application> allApplications = applicationService.findByJobs(myJobs);

        Map<JobPosting, List<Application>> jobApplicationMap = new LinkedHashMap<>();
        for (JobPosting job : myJobs) {
            List<Application> apps = allApplications.stream()
                    .filter(a -> a.getJob().getId().equals(job.getId()))
                    .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                    .toList();
            jobApplicationMap.put(job, apps);
        }

        long pendingCount = applicationService.countPending(myJobs);

        model.addAttribute("employer",          employer);
        model.addAttribute("myJobs",            myJobs);
        model.addAttribute("jobApplicationMap", jobApplicationMap);
        model.addAttribute("pendingCount",      pendingCount);
        model.addAttribute("totalCandidates",   allApplications.size());

        return "employer-home";
    }

    @GetMapping("/job/new")
    public String newJobForm(HttpSession session, Model model) {
        if (getEmployer(session) == null) return "redirect:/login";
        model.addAttribute("skills", skillService.findAll());
        model.addAttribute("job",    new JobPosting());
        return "employer-job-form";
    }

    @PostMapping("/job/new")
    public String saveJob(@ModelAttribute JobPosting job,
                          @RequestParam List<Long> skillIds,
                          HttpSession session,
                          Model model) {

        User employer = getEmployer(session);
        if (employer == null) return "redirect:/login";

        if (skillIds == null || skillIds.isEmpty()) {
            model.addAttribute("error", "En az bir yetenek seçmelisiniz.");
            model.addAttribute("skills", skillService.findAll());
            return "employer-job-form";
        }

        List<Skill> selectedSkills = skillIds.stream()
                .map(id -> skillService.findAll().stream()
                        .filter(s -> s.getId().equals(id))
                        .findFirst().orElseThrow())
                .toList();

        job.setRequiredSkills(selectedSkills);
        job.setCreatedBy(employer);
        jobPostingService.save(job);

        return "redirect:/employer/home";
    }

    @GetMapping("/job/delete/{id}")
    public String deleteJob(@PathVariable Long id, HttpSession session) {
        if (getEmployer(session) == null) return "redirect:/login";
        jobPostingService.deleteById(id);
        return "redirect:/employer/home";
    }
}