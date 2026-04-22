package com.mini.paymentservice.client;

import com.mini.paymentservice.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

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

    public Optional<UserDto> findUserById(Long userId) {
        logger.info("[COMMUNICATION] payment-service -> user-service: Fetching user details for userId: {}", userId);
        ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                userServiceBaseUrl + "/users",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<UserDto> users = response.getBody();
        if (users == null) {
            return Optional.empty();
        }

        return users.stream().filter(user -> user.getId().equals(userId)).findFirst();
    }
}
