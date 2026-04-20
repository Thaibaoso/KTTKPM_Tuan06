package com.mini.orderservice.dto;

import com.mini.orderservice.model.OrderStatus;

import java.util.List;

public class OrderResponse {

    private Long id;
    private Long userId;
    private List<OrderItemRequest> items;
    private double totalPrice;
    private OrderStatus status;

    public OrderResponse() {
    }

    public OrderResponse(Long id, Long userId, List<OrderItemRequest> items, double totalPrice, OrderStatus status) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
