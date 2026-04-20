package com.mini.paymentservice.service;

import com.mini.paymentservice.client.OrderClient;
import com.mini.paymentservice.client.UserClient;
import com.mini.paymentservice.dto.OrderDto;
import com.mini.paymentservice.dto.PaymentRequest;
import com.mini.paymentservice.dto.PaymentResponse;
import com.mini.paymentservice.dto.UserDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

@Service
public class PaymentService {

    private final OrderClient orderClient;
    private final UserClient userClient;

    public PaymentService(OrderClient orderClient, UserClient userClient) {
        this.orderClient = orderClient;
        this.userClient = userClient;
    }

    public PaymentResponse processPayment(PaymentRequest request) {
        if (request.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }

        String method = request.getMethod();
        if (method == null || method.isBlank()) {
            method = "COD";
        }

        OrderDto order;
        try {
            order = orderClient.getOrderById(request.getOrderId());
        } catch (RestClientException ex) {
            throw new IllegalArgumentException("Order not found");
        }

        if (order == null) {
            throw new IllegalArgumentException("Order not found");
        }

        UserDto user = userClient.findUserById(order.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for order"));

        if (!method.equalsIgnoreCase("COD") && !method.equalsIgnoreCase("BANKING")) {
            throw new IllegalArgumentException("Payment method must be COD or Banking");
        }

        orderClient.markOrderAsPaid(request.getOrderId());
        System.out.println("User " + user.getUsername() + " has successfully placed order #" + request.getOrderId());

        return new PaymentResponse("Payment successful via " + method, request.getOrderId(), "PAID");
    }
}
