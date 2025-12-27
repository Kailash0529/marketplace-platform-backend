package com.kailash.order.service.impl;

import com.kailash.order.client.CartClient;
import com.kailash.order.dto.ApiResponse;
import com.kailash.order.dto.CartResponse;
import com.kailash.order.dto.OrderRequest;
import com.kailash.order.dto.OrderResponse;
import com.kailash.order.entity.CartItem;
import com.kailash.order.entity.Order;
import com.kailash.order.entity.OrderItem;
import com.kailash.order.entity.OrderStatus;
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
    OrderRepository orderRepository;
    @Autowired
    CartClient cartClient;

    @Override
    public ApiResponse<OrderResponse> createOrder(String userId, OrderRequest orderRequest)
    {
        Order order=new Order();
        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }
        CartResponse cartResponse= cartClient.get(userId).getData();
        System.out.println(cartResponse+"0529");
        for(CartItem c:cartResponse.getItems())
        {
            OrderItem orderItem=new OrderItem();
            orderItem.setProductSku(c.getSku());
            orderItem.setQty(c.getQty());
            orderItem.setPrice(c.getPriceSnapshot());
            orderItem.setOrder(order);
            order.getItems().add(orderItem);
        }
        order.setTotalAmount(cartResponse.getTotalPrice());
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setStatus(OrderStatus.CREATED);
        order.setUserId(userId);
        order.setAddress(orderRequest.getAddress());
        Order savedOrder=orderRepository.save(order);
        return new ApiResponse<>(true,"created",new OrderResponse(savedOrder.getId(),savedOrder.getStatus(),savedOrder.getTotalAmount(),savedOrder.getAddress(),savedOrder.getItems()));

    }

    @Override
    public ApiResponse<OrderResponse> updateOrderStatus(Long orderId, OrderStatus orderStatus)
    {
        Order order=orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("No order found for given order id"));
        order.setStatus(orderStatus);

        Order savedOrder=orderRepository.save(order);
        return new ApiResponse<>(true,"Successfully update the order status",new OrderResponse(savedOrder.getId(),savedOrder.getStatus(),savedOrder.getTotalAmount(),savedOrder.getAddress(),savedOrder.getItems()));

    }

}
