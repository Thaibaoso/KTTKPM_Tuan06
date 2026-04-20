package com.mini.orderservice.client;

import com.mini.orderservice.dto.UserDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class UserClient {

    private final RestTemplate restTemplate;
    private final String userServiceBaseUrl;

    public UserClient(RestTemplate restTemplate,
                      @Value("${service.user.base-url}") String userServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.userServiceBaseUrl = userServiceBaseUrl;
    }

    public boolean userExists(Long userId) {
        ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                userServiceBaseUrl + "/users",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<UserDto> users = response.getBody();
        if (users == null) {
            return false;
        }

        return users.stream().anyMatch(user -> user.getId().equals(userId));
    }
}
