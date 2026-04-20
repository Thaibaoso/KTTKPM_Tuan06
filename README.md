# Mini Food Ordering System

Service-based demo with separate Spring Boot applications and a React frontend.

## Folder Structure

- `user-service` - register, login, users list on port `8081`
- `food-service` - food CRUD on port `8082`
- `order-service` - create and list orders on port `8083`
- `payment-service` - process payments on port `8084`
- `frontend` - ReactJS UI for the full flow

## Demo Flow

1. Register or login through the User Service.
2. Open the food list and add items to the cart.
3. Go to checkout and create an order.
4. Submit payment.
5. Payment Service updates the order and prints the success notification in the console.

## REST Calls

### User Service

- `POST http://localhost:8081/register`
- `POST http://localhost:8081/login`
- `GET http://localhost:8081/users`

### Food Service

- `GET http://localhost:8082/foods`
- `POST http://localhost:8082/foods`
- `PUT http://localhost:8082/foods/{id}`
- `DELETE http://localhost:8082/foods/{id}`

### Order Service

- `POST http://localhost:8083/orders`
- `GET http://localhost:8083/orders`

### Payment Service

- `POST http://localhost:8084/payments`

## Example Order Payload

```json
{
  "userId": 1,
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 3, "quantity": 1 }
  ]
}
```

## Example Payment Payload

```json
{
  "orderId": 1,
  "method": "COD"
}
```