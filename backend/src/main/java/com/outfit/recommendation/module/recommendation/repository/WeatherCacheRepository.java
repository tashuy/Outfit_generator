package com.outfit.recommendation.module.recommendation.repository;

import com.outfit.recommendation.module.recommendation.model.WeatherCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository("recommendationWeatherCacheRepository")
public interface WeatherCacheRepository extends JpaRepository<WeatherCache, UUID> {
    Optional<WeatherCache> findByLocationIgnoreCase(String location);
}
