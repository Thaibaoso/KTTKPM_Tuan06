package com.mini.orderservice.client;

import com.mini.orderservice.dto.FoodDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Component
public class FoodClient {

    private final RestTemplate restTemplate;
    private final String foodServiceBaseUrl;

    public FoodClient(RestTemplate restTemplate,
                      @Value("${service.food.base-url}") String foodServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.foodServiceBaseUrl = foodServiceBaseUrl;
    }

    public Optional<FoodDto> findFoodById(Long foodId) {
        ResponseEntity<List<FoodDto>> response = restTemplate.exchange(
                foodServiceBaseUrl + "/foods",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<FoodDto> foods = response.getBody();
        if (foods == null) {
            return Optional.empty();
        }

        return foods.stream().filter(food -> food.getId().equals(foodId)).findFirst();
    }
}
