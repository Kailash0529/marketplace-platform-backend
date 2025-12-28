package com. kailash. order. dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String sku;
    private String name;
    private String shortDescription;
    private Double price;
    private Integer stock;
}
