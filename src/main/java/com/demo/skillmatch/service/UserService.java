package com.demo.skillmatch.service;
import com.demo.skillmatch.model.User;
import com.demo.skillmatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findByIdOrNull(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    // Mevcut UserService'inize sadece bu metodu ekleyin

    public List<User> findAllSeekers() {
        return userRepository.findByRole("SEEKER");
    }
}
