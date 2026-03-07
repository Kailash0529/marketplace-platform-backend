package com.kailash.apigateway.service;

import com.kailash.apigateway.dto.ApiResponse;
import com.kailash.apigateway.dto.LoginRequest;
import com.kailash.apigateway.dto.RegisterRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AuthService {
    ApiResponse<Map<String, Object>> login(LoginRequest req);

    ApiResponse<Map<String, Object>> register(RegisterRequest req);

    ApiResponse<Map<String, Object>> refresh(String refreshTokenId);

    ApiResponse<Void> logout(String refreshTokenId);
}
