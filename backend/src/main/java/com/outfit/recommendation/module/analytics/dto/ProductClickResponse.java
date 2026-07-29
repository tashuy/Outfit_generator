package com.outfit.recommendation.module.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductClickResponse {
    private UUID productId;
    private String productUrl;
    private Long clickCount;
}
