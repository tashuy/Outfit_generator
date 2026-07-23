package com.outfit.recommendation.module.weather.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "WeatherModuleCache")
@Table(name = "weather_caches", indexes = {
    @Index(name = "idx_weather_location", columnList = "location_key", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherCache {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "location_key", nullable = false, unique = true)
    private String locationKey;

    @Column(name = "weather_data", nullable = false, length = 2000)
    private String weatherData;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
}
