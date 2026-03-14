package com.demo.skillmatch.controller;

import com.demo.skillmatch.model.Skill;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.service.SkillService;
import com.demo.skillmatch.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final SkillService skillService;

    // ─────────────────────────────────────────
    // ROL SEÇİMİ  →  /role-select
    // ─────────────────────────────────────────

    @GetMapping("/role-select")
    public String roleSelectPage() {
        return "role-select";       // role-select.html
    }

    // ─────────────────────────────────────────
    // LOGIN  →  /login
    // ─────────────────────────────────────────

    // Mevcut kodunuz korundu, sadece role parametresi eklendi
    @GetMapping("/login")
    public String loginPage(@RequestParam(required = false) String role,
                            Model model) {
        model.addAttribute("role", role != null ? role : "seeker");
        return "login";             // login.html
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        @RequestParam(required = false) String role,
                        HttpSession session,
                        Model model) {

        return userService.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .map(u -> {
                    session.setAttribute("loggedUser", u);
                    // Kullanıcının rolüne göre farklı dashboard'a yönlendir
                    if ("EMPLOYER".equalsIgnoreCase(u.getRole())) {
                        return "redirect:/employer/home";
                    }
                    return "redirect:/home";
                })
                .orElseGet(() -> {
                    model.addAttribute("error", "Email veya şifre hatalı!");
                    model.addAttribute("role", role != null ? role : "seeker");
                    return "login";
                });
    }

    // ─────────────────────────────────────────
    // REGISTER — SEEKER  →  /register  (mevcut)
    // ─────────────────────────────────────────

    @GetMapping("/register")
    public String registerPage(@RequestParam(required = false) String role,
                               Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("skills", skillService.findAll());

        if ("employer".equalsIgnoreCase(role)) {
            return "register-employer";     // register-employer.html
        }
        return "register-seeker";           // register-seeker.html
    }

    // Mevcut POST /register korundu — sadece role set edildi
    @PostMapping("/register")
    public String register(@ModelAttribute User user,
                           @RequestParam List<Long> skillIds,
                           Model model) {

        if (userService.existsByEmail(user.getEmail())) {
            model.addAttribute("error", "Bu email zaten kayıtlı!");
            model.addAttribute("skills", skillService.findAll());
            return "register-seeker";
        }

        List<Skill> selectedSkills = skillIds.stream()
                .map(id -> skillService.findAll().stream()
                        .filter(s -> s.getId().equals(id))
                        .findFirst().orElseThrow())
                .toList();

        user.setSkills(selectedSkills);
        user.setRole("SEEKER");             // ← eklendi
        userService.save(user);

        return "redirect:/login?role=seeker";
    }

    // ─────────────────────────────────────────
    // REGISTER — EMPLOYER  →  /register/employer
    // ─────────────────────────────────────────

    @PostMapping("/register/employer")
    public String registerEmployer(@ModelAttribute User user,
                                   @RequestParam(required = false) List<Long> skillIds,
                                   Model model) {

        if (userService.existsByEmail(user.getEmail())) {
            model.addAttribute("error", "Bu email zaten kayıtlı!");
            model.addAttribute("skills", skillService.findAll());
            return "register-employer";
        }

        // İşverenin aradığı yetenekler (opsiyonel)
        if (skillIds != null && !skillIds.isEmpty()) {
            List<Skill> selectedSkills = skillIds.stream()
                    .map(id -> skillService.findAll().stream()
                            .filter(s -> s.getId().equals(id))
                            .findFirst().orElseThrow())
                    .toList();
            user.setSkills(selectedSkills);
        }

        user.setRole("EMPLOYER");           // ← eklendi
        userService.save(user);

        return "redirect:/login?role=employer";
    }

    // ─────────────────────────────────────────
    // LOGOUT  →  /logout  (mevcut, değişmedi)
    // ─────────────────────────────────────────

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/role-select";     // login yerine role-select'e döner
    }
}