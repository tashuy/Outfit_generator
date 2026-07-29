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
public class TopOutfitDto {
    private UUID id;
    private String title;
    private String location;
    private String category;
    private Long views;
    private String thumbnail;
}
