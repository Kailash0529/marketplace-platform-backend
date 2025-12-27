package com.kailash.order.service;

import com.kailash.order.dto.ApiResponse;
import com.kailash.order.dto.OrderRequest;
import com.kailash.order.dto.OrderResponse;
import com.kailash.order.entity.Order;
import org.springframework.stereotype.Service;

@Service
public interface OrderService {

    ApiResponse<OrderResponse> createOrder(String userId, OrderRequest orderRequest);
}
