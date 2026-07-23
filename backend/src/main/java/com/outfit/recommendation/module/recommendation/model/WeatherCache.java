package com.outfit.recommendation.module.recommendation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "weather_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherCache {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String location;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private String weatherCondition;

    private Double humidity;

    @Column(name = "wind_speed")
    private Double windSpeed;

    @Column(name = "cached_at", nullable = false)
    private LocalDateTime cachedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.cachedAt = LocalDateTime.now();
    }
}
