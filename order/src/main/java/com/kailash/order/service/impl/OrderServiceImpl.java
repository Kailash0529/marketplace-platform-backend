package com.kailash.order.service.impl;

import com.kailash.order.client.CartClient;
import com.kailash.order.client.ProductClient;
import com.kailash.order.dto.*;
import com.kailash.order.entity.*;
import com.kailash.order.exception.NotFoundException;
import com.kailash.order.repository.OrderRepository;
import com.kailash.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartClient cartClient;

    @Autowired
    private ProductClient productClient;

    @Override
    public ApiResponse<OrderResponse> createOrder(String userId, OrderRequest orderRequest) {


        CartResponse cart = cartClient.get(userId)
                .getData();

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty — cannot create order");
        }

        Order order = new Order();
        order.setItems(new ArrayList<>());
        order.setStatus(OrderStatus.CREATED);
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setUserId(userId);
        order.setAddress(orderRequest.getAddress());

        Double total = 0.0;


        for (CartItem c : cart.getItems()) {

            var productApiResp = productClient.get(c.getSku());

            if (productApiResp == null || !productApiResp.isSuccess() || productApiResp.getData() == null) {
                throw new RuntimeException("Product not found: " + c.getSku());
            }

            var p = productApiResp.getData();


            if (p.getStock() != null && p.getStock() < c.getQty()) {
                throw new RuntimeException("Not enough stock for: " + c.getSku());
            }

            Double price =p.getPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductSku(c.getSku());
            orderItem.setQty(c.getQty());
            orderItem.setPrice(price);

            order.getItems().add(orderItem);

            total = total+(price*(c.getQty()));
        }


        order.setTotalAmount(total);


        Order saved = orderRepository.save(order);


        OrderResponse response = new OrderResponse(
                saved.getId(),
                saved.getStatus(),
                saved.getTotalAmount(),
                saved.getAddress(),
                saved.getItems()
        );

        return new ApiResponse<>(true,"CREATED",response);
    }

    @Override
    public ApiResponse<OrderResponse> updateOrderStatus(Long orderId, OrderStatus orderStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("No order found for given order id"));

        order.setStatus(orderStatus);

        Order saved = orderRepository.save(order);

        OrderResponse resp = new OrderResponse(
                saved.getId(),
                saved.getStatus(),
                saved.getTotalAmount(),
                saved.getAddress(),
                saved.getItems()
        );

        return new ApiResponse<>(true,"Successfully update the order status",resp);
    }
}
