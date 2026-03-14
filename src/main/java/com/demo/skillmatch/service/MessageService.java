package com.demo.skillmatch.service;

import com.demo.skillmatch.model.Application;
import com.demo.skillmatch.model.Message;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<Message> findByApplication(Application application) {
        return messageRepository.findByApplicationOrderBySentAtAsc(application);
    }

    public Message send(Application application, User sender, String content) {
        Message msg = new Message();
        msg.setApplication(application);
        msg.setSender(sender);
        msg.setContent(content);
        return messageRepository.save(msg);
    }
    public long countUnreadForUser(User user) {
        if ("EMPLOYER".equalsIgnoreCase(user.getRole())) {
            return messageRepository.countUnreadForEmployer(user);
        }
        return messageRepository.countUnreadForSeeker(user);
    }

    public void markAllReadForApplication(Application application, User reader) {
        List<Message> msgs = messageRepository.findByApplicationOrderBySentAtAsc(application);
        msgs.forEach(m -> {
            if (!m.getSender().getId().equals(reader.getId())) {
                m.setRead(true);
            }
        });
        messageRepository.saveAll(msgs);
    }
}