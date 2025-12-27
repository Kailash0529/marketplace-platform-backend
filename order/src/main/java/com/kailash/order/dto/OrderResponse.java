package com.kailash.order.dto;

import com.kailash.order.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import com.kailash.order.entity.OrderStatus;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Long orderId;
    private OrderStatus status;
    private Double totalAmount;
    private String address;
    private List<OrderItem> items;
}
