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
    public ResponseEntity<FoodResponse> createFood(@RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.createFood(request));
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodResponse> updateFood(@PathVariable Long id, @RequestBody FoodRequest request) {
        return ResponseEntity.ok(foodService.updateFood(id, request));
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Map<String, String>> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(Map.of("message", "Food deleted"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
