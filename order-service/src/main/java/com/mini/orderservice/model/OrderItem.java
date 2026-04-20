package com.mini.orderservice.model;

public class OrderItem {

    private Long foodId;
    private int quantity;

    public OrderItem() {
    }

    public OrderItem(Long foodId, int quantity) {
        this.foodId = foodId;
        this.quantity = quantity;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
