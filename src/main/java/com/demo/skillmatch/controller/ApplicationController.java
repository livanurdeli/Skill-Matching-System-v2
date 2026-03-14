package com.demo.skillmatch.controller;

import com.demo.skillmatch.model.JobPosting;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.service.ApplicationService;
import com.demo.skillmatch.service.JobPostingService;
import com.demo.skillmatch.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JobPostingService  jobPostingService;
    private final UserService        userService;

    // Tek tıkla başvur  POST /apply/{jobId}
    @PostMapping("/apply/{jobId}")
    public String apply(@PathVariable Long jobId, HttpSession session) {

        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return "redirect:/login";

        User seeker = userService.findByIdOrNull(sessionUser.getId());
        JobPosting job = jobPostingService.findById(jobId);

        if (seeker == null || job == null) return "redirect:/home";

        applicationService.apply(seeker, job);
        return "redirect:/home";
    }
}
