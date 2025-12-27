package com.kailash.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {

    private String productSku;
    private Integer qty;
    private Double price;
}
