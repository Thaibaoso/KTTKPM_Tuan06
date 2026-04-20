package com.mini.orderservice.dto;

import com.mini.orderservice.model.OrderStatus;

public class UpdateStatusRequest {

    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
