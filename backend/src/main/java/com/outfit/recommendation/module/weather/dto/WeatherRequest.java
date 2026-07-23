package com.outfit.recommendation.module.weather.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherRequest {
    @NotBlank(message = "City is required")
    private String city;
}
