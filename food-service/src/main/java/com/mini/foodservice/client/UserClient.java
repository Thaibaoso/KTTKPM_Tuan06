package com.mini.foodservice.client;

import com.mini.foodservice.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class UserClient {

    private static final Logger logger = LoggerFactory.getLogger(UserClient.class);
    private final RestTemplate restTemplate;
    private final String userServiceBaseUrl;

    public UserClient(RestTemplate restTemplate,
                      @Value("${service.user.base-url}") String userServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.userServiceBaseUrl = userServiceBaseUrl;
    }

    public boolean isAdmin(Long userId) {
        if (userId == null) return false;
        
        logger.info("[COMMUNICATION] food-service -> user-service: Fetching users to verify Admin role for userId: {}", userId);
        try {
            ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                    userServiceBaseUrl + "/users",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );

            List<UserDto> users = response.getBody();
            if (users == null) return false;

            return users.stream()
                    .filter(user -> user.getId().equals(userId))
                    .map(user -> "ADMIN".equalsIgnoreCase(user.getRole()))
                    .findFirst()
                    .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }
}
