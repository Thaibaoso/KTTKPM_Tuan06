package com.mini.userservice.service;

import com.mini.userservice.dto.LoginRequest;
import com.mini.userservice.dto.RegisterRequest;
import com.mini.userservice.dto.UserResponse;
import com.mini.userservice.model.Role;
import com.mini.userservice.model.User;
import com.mini.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        seedAdmin();
    }

    public UserResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        Role role = request.getRole() == null ? Role.USER : request.getRole();
        User user = new User(null, request.getUsername(), request.getPassword(), role);
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return toResponse(user);
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole());
    }

    private void seedAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new User(null, "admin", "admin123", Role.ADMIN));
        }
    }
}
