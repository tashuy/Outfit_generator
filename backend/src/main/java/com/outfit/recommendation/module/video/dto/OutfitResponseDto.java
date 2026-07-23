package com.outfit.recommendation.module.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitResponseDto {
    private UUID id;
    private String title;
    private String description;
    private String mediaUrl;
    private String publicId;
    private String mediaType;
    private String category;
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    private Boolean isLocationSpecific;
    private String location;
    @Builder.Default
    private List<String> locations = new ArrayList<>();

    private String occasion;
    private String style;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<OutfitProductDto> products = new ArrayList<>();
}
