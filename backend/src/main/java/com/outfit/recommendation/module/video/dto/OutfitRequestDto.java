package com.outfit.recommendation.module.video.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    private String publicId;

    private String mediaType; // IMAGE or VIDEO

    private String category;

    @Builder.Default
    private List<String> categories = new ArrayList<>();

    @Builder.Default
    private Boolean isLocationSpecific = true;

    private String location;

    @Builder.Default
    private List<String> locations = new ArrayList<>();

    private String occasion;

    private String style;

    @Valid
    @Builder.Default
    private List<OutfitProductDto> products = new ArrayList<>();
}
