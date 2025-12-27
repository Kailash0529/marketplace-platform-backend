package com.kailash.order.dto;

import com.kailash.order.entity.CartItem;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartResponse {

    @Id
    private String id;
    private String memberId;
    private int totalItems;
    private Double totalPrice;
    private List<CartItem> items;

}
