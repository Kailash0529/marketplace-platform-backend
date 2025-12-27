package com.kailash.order.controller;
import com.kailash.order.dto.ApiResponse;
import com.kailash.order.dto.OrderRequest;
import com.kailash.order.dto.OrderResponse;
import com.kailash.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    OrderService orderService;


    @PostMapping("/create")
    public ApiResponse<OrderResponse> createOrder(@RequestHeader(name = "X-User-Id") String userId, @RequestBody OrderRequest req)
    {

        return orderService.createOrder(userId,req);

    }

}