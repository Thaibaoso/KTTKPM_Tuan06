package com.mini.orderservice.service;

import com.mini.orderservice.client.FoodClient;
import com.mini.orderservice.client.UserClient;
import com.mini.orderservice.dto.CreateOrderRequest;
import com.mini.orderservice.dto.FoodDto;
import com.mini.orderservice.dto.OrderItemRequest;
import com.mini.orderservice.dto.OrderResponse;
import com.mini.orderservice.model.Order;
import com.mini.orderservice.model.OrderItem;
import com.mini.orderservice.model.OrderStatus;
import com.mini.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserClient userClient;
    private final FoodClient foodClient;

    public OrderService(OrderRepository orderRepository, UserClient userClient, FoodClient foodClient) {
        this.orderRepository = orderRepository;
        this.userClient = userClient;
        this.foodClient = foodClient;
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order items are required");
        }

        if (!userClient.userExists(request.getUserId())) {
            throw new IllegalArgumentException("User not found in User Service");
        }

        double totalPrice = 0;
        for (OrderItemRequest item : request.getItems()) {
            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Item quantity must be greater than zero");
            }
            FoodDto food = foodClient.findFoodById(item.getFoodId())
                    .orElseThrow(() -> new IllegalArgumentException("Food not found for ID: " + item.getFoodId()));
            totalPrice += food.getPrice() * item.getQuantity();
        }

        List<OrderItem> orderItems = request.getItems().stream()
                .map(item -> new OrderItem(item.getFoodId(), item.getQuantity()))
                .toList();

        Order order = new Order(null, request.getUserId(), orderItems, totalPrice, OrderStatus.CREATED);
        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return toResponse(order);
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemRequest> itemResponses = order.getItems().stream()
                .map(item -> {
                    OrderItemRequest dto = new OrderItemRequest();
                    dto.setFoodId(item.getFoodId());
                    dto.setQuantity(item.getQuantity());
                    return dto;
                })
                .toList();

        return new OrderResponse(order.getId(), order.getUserId(), itemResponses, order.getTotalPrice(), order.getStatus());
    }
}
