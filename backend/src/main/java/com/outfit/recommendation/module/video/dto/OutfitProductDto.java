package com.outfit.recommendation.module.video.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitProductDto {
    private UUID id;

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Product URL is required")
    private String productUrl;

    @NotBlank(message = "Platform is required")
    private String platform;

    private Long clickCount;
}
