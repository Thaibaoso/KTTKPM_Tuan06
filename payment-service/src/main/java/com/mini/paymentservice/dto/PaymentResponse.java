package com.mini.paymentservice.dto;

public class PaymentResponse {

    private String message;
    private Long orderId;
    private String status;

    public PaymentResponse() {
    }

    public PaymentResponse(String message, Long orderId, String status) {
        this.message = message;
        this.orderId = orderId;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
