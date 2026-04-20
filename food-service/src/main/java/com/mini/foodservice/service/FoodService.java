package com.mini.foodservice.service;

import com.mini.foodservice.dto.FoodRequest;
import com.mini.foodservice.dto.FoodResponse;
import com.mini.foodservice.model.Food;
import com.mini.foodservice.repository.FoodRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @PostConstruct
    public void seedFoods() {
        if (!foodRepository.findAll().isEmpty()) {
            return;
        }
        foodRepository.save(new Food(null, "Cheese Burger", "Beef patty with cheddar", 5.99));
        foodRepository.save(new Food(null, "Chicken Pizza", "Thin crust pizza with chicken", 9.49));
        foodRepository.save(new Food(null, "Caesar Salad", "Fresh romaine with dressing", 4.25));
    }

    public List<FoodResponse> getFoods() {
        return foodRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public FoodResponse createFood(FoodRequest request) {
        validateRequest(request);
        Food food = new Food(null, request.getName(), request.getDescription(), request.getPrice());
        return toResponse(foodRepository.save(food));
    }

    public FoodResponse updateFood(Long id, FoodRequest request) {
        validateRequest(request);
        Food existing = foodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food not found"));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());

        return toResponse(foodRepository.save(existing));
    }

    public void deleteFood(Long id) {
        if (foodRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Food not found");
        }
        foodRepository.deleteById(id);
    }

    private void validateRequest(FoodRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Food name is required");
        }
        if (request.getPrice() <= 0) {
            throw new IllegalArgumentException("Food price must be greater than zero");
        }
    }

    private FoodResponse toResponse(Food food) {
        return new FoodResponse(food.getId(), food.getName(), food.getDescription(), food.getPrice());
    }
}
