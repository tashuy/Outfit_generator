package com.outfit.recommendation.module.recommendation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class OutfitGenerationRequest {
    @NotBlank(message = "Occasion is required")
    private String occasion; // e.g., Date, College, Wedding, Vacation, etc.

    @NotBlank(message = "Budget is required")
    private String budget; // e.g., Under ₹999, ₹1000-₹2000, etc.

    @NotBlank(message = "Style is required")
    private String style; // e.g., Old Money, Korean, Casual, etc.

    @NotBlank(message = "Gender is required")
    private String gender; // e.g., Male, Female, Unisex

    @NotBlank(message = "Location is required")
    private String location; // e.g., Indore, Bangalore, Mumbai, etc.

    private Integer age;
    private String bodyType;
    private List<String> favoriteColors;
    private List<String> avoidColors;
    private Double height;
    private Double weight;
}
