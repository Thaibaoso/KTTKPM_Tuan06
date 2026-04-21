package com.mini.foodservice.controller;

import com.mini.foodservice.dto.FoodRequest;
import com.mini.foodservice.dto.FoodResponse;
import com.mini.foodservice.service.FoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping("/foods")
    public ResponseEntity<List<FoodResponse>> getFoods() {
        return ResponseEntity.ok(foodService.getFoods());
    }

    @PostMapping("/foods")
    public ResponseEntity<FoodResponse> createFood(@RequestHeader("X-User-Id") Long userId,
                                                   @RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.createFood(userId, request));
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodResponse> updateFood(@RequestHeader("X-User-Id") Long userId,
                                                   @PathVariable Long id,
                                                   @RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.updateFood(userId, id, request));
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Map<String, String>> deleteFood(@RequestHeader("X-User-Id") Long userId,
                                                          @PathVariable Long id) {
        foodService.deleteFood(userId, id);
        return ResponseEntity.ok(Map.of("message", "Food deleted"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
