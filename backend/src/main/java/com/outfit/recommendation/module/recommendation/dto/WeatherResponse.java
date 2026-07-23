package com.outfit.recommendation.module.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Double temperature;
    private Double humidity;
    private String season;
    private Double rainProbability;
    private String advice;
}
