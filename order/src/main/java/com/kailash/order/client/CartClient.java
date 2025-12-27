package com.kailash.order.client;

import com.kailash.order.dto.ApiResponse;
import com.kailash.order.dto.CartResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
@FeignClient(name = "cart",url = "http://localhost:8089")
public interface CartClient {

@GetMapping("/cart")
ApiResponse<CartResponse> get(@RequestHeader(name = "X-User-Id") String memberId);

}
