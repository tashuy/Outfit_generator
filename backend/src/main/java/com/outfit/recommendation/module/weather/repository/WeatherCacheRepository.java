package com.outfit.recommendation.module.weather.repository;

import com.outfit.recommendation.module.weather.model.WeatherCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeatherCacheRepository extends JpaRepository<WeatherCache, UUID> {
    Optional<WeatherCache> findByLocationKey(String locationKey);
    void deleteByLocationKey(String locationKey);
}
