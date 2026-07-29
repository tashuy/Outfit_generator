package com.outfit.recommendation.module.weather.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String city;
    private String country;
    private Double temperature;
    private Double feelsLike;
    private Integer humidity;
    private Double windSpeed;
    private String condition;
    private String season;
    private Double rainProbability;
    private String advice;
    private Boolean cached;

    public String getAdvice() {
        if (advice != null && !advice.trim().isEmpty()) {
            return advice;
        }
        return "Dress comfortably for " + (season != null ? season : "current") + " weather conditions.";
    }
}
