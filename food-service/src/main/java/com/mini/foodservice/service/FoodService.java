package com.mini.foodservice.service;

import com.mini.foodservice.client.UserClient;
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
    private final UserClient userClient;

    public FoodService(FoodRepository foodRepository, UserClient userClient) {
        this.foodRepository = foodRepository;
        this.userClient = userClient;
    }

    @PostConstruct
    public void seedFoods() {
        if (!foodRepository.findAll().isEmpty()) {
            return;
        }
        foodRepository.save(new Food(null, "Bánh Burger Phô Mai", "Thịt bò nướng kèm phô mai cheddar tan chảy", 5.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"));
        foodRepository.save(new Food(null, "Pizza Gà Nướng", "Đế bánh mỏng giòn cùng gà nướng thơm nức", 9.49, "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"));
        foodRepository.save(new Food(null, "Salad Caesar", "Rau xà lách tươi sạch kèm nước sốt đặc trưng", 4.25, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop"));
        foodRepository.save(new Food(null, "Cà Phê Sữa", "Cà phê Robusta đậm đà pha cùng sữa đặc thượng hạng", 2.12, "https://images.unsplash.com/photo-1559496417-e7f25bc247f3?q=80&w=800&auto=format&fit=crop"));
    }

    public List<FoodResponse> getFoods() {
        return foodRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public FoodResponse createFood(Long userId, FoodRequest request) {
        checkAdminRole(userId);
        validateRequest(request);
        Food food = new Food(null, request.getName(), request.getDescription(), request.getPrice(), request.getImageUrl());
        return toResponse(foodRepository.save(food));
    }

    public FoodResponse updateFood(Long userId, Long id, FoodRequest request) {
        checkAdminRole(userId);
        validateRequest(request);
        Food existing = foodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food not found"));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setImageUrl(request.getImageUrl());

        return toResponse(foodRepository.save(existing));
    }

    public void deleteFood(Long userId, Long id) {
        checkAdminRole(userId);
        if (foodRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Food not found");
        }
        foodRepository.deleteById(id);
    }

    private void checkAdminRole(Long userId) {
        if (userId == null || !userClient.isAdmin(userId)) {
            throw new IllegalArgumentException("Unauthorized: Only Admins can perform this action");
        }
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
        return new FoodResponse(food.getId(), food.getName(), food.getDescription(), food.getPrice(), food.getImageUrl());
    }
}
