package com.mini.paymentservice.client;

import com.mini.paymentservice.dto.OrderDto;
import com.mini.paymentservice.dto.UpdateOrderStatusRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OrderClient {

    private final RestTemplate restTemplate;
    private final String orderServiceBaseUrl;

    public OrderClient(RestTemplate restTemplate,
                       @Value("${service.order.base-url}") String orderServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.orderServiceBaseUrl = orderServiceBaseUrl;
    }

    public OrderDto getOrderById(Long orderId) {
        ResponseEntity<OrderDto> response = restTemplate.getForEntity(
                orderServiceBaseUrl + "/orders/" + orderId,
                OrderDto.class
        );
        return response.getBody();
    }

    public void markOrderAsPaid(Long orderId) {
        restTemplate.put(
                orderServiceBaseUrl + "/orders/" + orderId + "/status",
                new UpdateOrderStatusRequest("PAID")
        );
    }
}
