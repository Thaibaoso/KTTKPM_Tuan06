package com.mini.foodservice.repository;

import com.mini.foodservice.model.Food;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class FoodRepository {

    private final ConcurrentHashMap<Long, Food> foods = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public Food save(Food food) {
        if (food.getId() == null) {
            food.setId(idGenerator.incrementAndGet());
        }
        foods.put(food.getId(), food);
        return food;
    }

    public List<Food> findAll() {
        return new ArrayList<>(foods.values());
    }

    public Optional<Food> findById(Long id) {
        return Optional.ofNullable(foods.get(id));
    }

    public void deleteById(Long id) {
        foods.remove(id);
    }
}
