package com.demo.skillmatch.controller;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.Message;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.repository.ApplicationRepository;
import com.demo.skillmatch.repository.MessageRepository;
import com.demo.skillmatch.service.MessageService;
import com.demo.skillmatch.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
private final MessageRepository messageRepository;
    private final MessageService         messageService;
    private final ApplicationRepository  applicationRepository;
    private final UserService            userService;

    // GET /chat/{applicationId}/messages
    @GetMapping("/{applicationId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long applicationId,
                                         HttpSession session) {

        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return ResponseEntity.status(401).build();

        Application app = applicationRepository.findById(applicationId).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        List<Message> messages = messageService.findByApplication(app);

        List<Map<String, Object>> result = messages.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id",         m.getId());
            map.put("content",    m.getContent());
            map.put("senderName", m.getSender().getName());
            map.put("senderId",   m.getSender().getId());
            map.put("sentAt",     m.getSentAt().toString());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }
    @GetMapping("/last-application")
    public ResponseEntity<?> lastApplication(HttpSession session) {
        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return ResponseEntity.status(401).build();

        User user = userService.findByIdOrNull(sessionUser.getId());

        List<Application> apps;
        if ("EMPLOYER".equalsIgnoreCase(user.getRole())) {
            apps = messageRepository.findUnreadApplicationsForEmployer(user);
        } else {
            apps = messageRepository.findUnreadApplicationsForSeeker(user);
        }

        if (apps.isEmpty()) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("appId", null);
            return ResponseEntity.ok(resp);
        }

        Application app = apps.get(0);
        Map<String, Object> resp = new HashMap<>();
        resp.put("appId", app.getId());
        resp.put("name", app.getJob().getTitle());
        return ResponseEntity.ok(resp);
    }
    // POST /chat/{applicationId}/send
    @PostMapping("/{applicationId}/send")
    public ResponseEntity<?> sendMessage(@PathVariable Long applicationId,
                                         @RequestBody Map<String, String> body,
                                         HttpSession session) {

        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return ResponseEntity.status(401).build();

        Application app = applicationRepository.findById(applicationId).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        User sender = userService.findByIdOrNull(sessionUser.getId());
        String content = body.get("content");
        if (content == null || content.isBlank()) return ResponseEntity.badRequest().build();

        Message msg = messageService.send(app, sender, content);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id",         msg.getId());
        resp.put("content",    msg.getContent());
        resp.put("senderName", msg.getSender().getName());
        resp.put("senderId",   msg.getSender().getId());
        resp.put("sentAt",     msg.getSentAt().toString());

        return ResponseEntity.ok(resp);
    }
    // GET /chat/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(HttpSession session) {
        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return ResponseEntity.status(401).build();

        User user = userService.findByIdOrNull(sessionUser.getId());
        long count = messageService.countUnreadForUser(user);

        Map<String, Object> resp = new HashMap<>();
        resp.put("count", count);
        return ResponseEntity.ok(resp);
    }
    // POST /chat/{applicationId}/read
    @PostMapping("/{applicationId}/read")
    public ResponseEntity<?> markRead(@PathVariable Long applicationId, HttpSession session) {
        User sessionUser = (User) session.getAttribute("loggedUser");
        if (sessionUser == null) return ResponseEntity.status(401).build();

        Application app = applicationRepository.findById(applicationId).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        User reader = userService.findByIdOrNull(sessionUser.getId());
        messageService.markAllReadForApplication(app, reader);
        return ResponseEntity.ok().build();
    }

}