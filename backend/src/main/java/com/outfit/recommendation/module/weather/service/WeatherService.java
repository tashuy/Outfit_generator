package com.outfit.recommendation.module.weather.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import com.outfit.recommendation.module.weather.model.WeatherCache;
import com.outfit.recommendation.module.weather.repository.WeatherCacheRepository;
import com.outfit.recommendation.module.weather.util.SeasonDetector;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class WeatherService {

    @Autowired
    private WeatherProvider weatherProvider;

    @Autowired
    private WeatherCacheRepository cacheRepository;

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final long CACHE_TTL_MINUTES = 30;

    /**
     * Gets the weather for a city, prioritizing caches.
     */
    @Transactional
    public WeatherResponse getWeather(String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new IllegalArgumentException("City cannot be empty");
        }

        String normalizedCity = city.trim().toLowerCase();
        String cacheKey = "weather:" + normalizedCity;

        // 1. Try L1 Cache (Redis)
        WeatherResponse redisCachedResponse = getFromL1Cache(cacheKey);
        if (redisCachedResponse != null) {
            log.info("L1 Cache (Redis) hit for: {}", normalizedCity);
            redisCachedResponse.setCached(true);
            return redisCachedResponse;
        }

        // 2. Try L2 Cache (Database)
        Optional<WeatherCache> dbCachedEntity = cacheRepository.findByLocationKey(cacheKey);
        if (dbCachedEntity.isPresent()) {
            WeatherCache cache = dbCachedEntity.get();
            if (cache.getExpiresAt().isAfter(LocalDateTime.now())) {
                log.info("L2 Cache (Database) hit for: {}", normalizedCity);
                try {
                    WeatherResponse response = objectMapper.readValue(cache.getWeatherData(), WeatherResponse.class);
                    response.setCached(true);

                    // Re-populate L1 cache asynchronously or inline
                    saveToL1Cache(cacheKey, response);

                    return response;
                } catch (JsonProcessingException e) {
                    log.error("Failed to parse L2 cached weather data for: {}", normalizedCity, e);
                    // Fallback to fetch new if parsing fails
                }
            } else {
                log.info("L2 Cache expired for: {}. Cleaning up database record.", normalizedCity);
                cacheRepository.delete(cache);
            }
        }

        // 3. Cache Miss: Fetch from External API
        log.info("Cache miss for: {}. Fetching from external Weather API.", normalizedCity);
        WeatherResponse freshResponse = weatherProvider.fetchWeather(city);

        // 4. Season Detection
        int currentMonth = LocalDateTime.now().getMonthValue();
        String season = SeasonDetector.detectSeason(freshResponse.getCountry(), currentMonth, freshResponse.getCondition());
        freshResponse.setSeason(season);
        freshResponse.setCached(false);

        // 5. Update Caches (L1 and L2)
        saveToL2Cache(cacheKey, freshResponse);
        saveToL1Cache(cacheKey, freshResponse);

        return freshResponse;
    }

    /**
     * Fetch from Redis (L1 Cache).
     */
    private WeatherResponse getFromL1Cache(String key) {
        if (redisTemplate == null) {
            log.debug("RedisTemplate is not available. Skipping L1 cache lookup.");
            return null;
        }
        try {
            String json = redisTemplate.opsForValue().get(key);
            if (json != null) {
                return objectMapper.readValue(json, WeatherResponse.class);
            }
        } catch (Exception ex) {
            log.warn("Redis L1 cache read failure (Cache Failure): {}", ex.getMessage());
        }
        return null;
    }

    /**
     * Save to Redis (L1 Cache) with TTL.
     */
    private void saveToL1Cache(String key, WeatherResponse response) {
        if (redisTemplate == null) {
            return;
        }
        try {
            // Ensure cached field is true inside cache store
            WeatherResponse toStore = WeatherResponse.builder()
                    .city(response.getCity())
                    .country(response.getCountry())
                    .temperature(response.getTemperature())
                    .feelsLike(response.getFeelsLike())
                    .humidity(response.getHumidity())
                    .windSpeed(response.getWindSpeed())
                    .condition(response.getCondition())
                    .season(response.getSeason())
                    .cached(true)
                    .build();

            String json = objectMapper.writeValueAsString(toStore);
            redisTemplate.opsForValue().set(key, json, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
            log.debug("Saved to L1 Cache (Redis) for key: {}", key);
        } catch (Exception ex) {
            log.warn("Redis L1 cache write failure (Cache Failure): {}", ex.getMessage());
        }
    }

    /**
     * Save to DB (L2 Cache) with expiration.
     */
    private void saveToL2Cache(String key, WeatherResponse response) {
        try {
            // Build response to save in cache (ensure cached status is true when reloaded)
            WeatherResponse toStore = WeatherResponse.builder()
                    .city(response.getCity())
                    .country(response.getCountry())
                    .temperature(response.getTemperature())
                    .feelsLike(response.getFeelsLike())
                    .humidity(response.getHumidity())
                    .windSpeed(response.getWindSpeed())
                    .condition(response.getCondition())
                    .season(response.getSeason())
                    .cached(true)
                    .build();

            String json = objectMapper.writeValueAsString(toStore);
            
            // Delete existing cache entry if present (due to unique index)
            cacheRepository.findByLocationKey(key).ifPresent(cacheRepository::delete);

            WeatherCache newCache = WeatherCache.builder()
                    .locationKey(key)
                    .weatherData(json)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMinutes(CACHE_TTL_MINUTES))
                    .build();

            cacheRepository.save(newCache);
            log.debug("Saved to L2 Cache (Database) for key: {}", key);
        } catch (Exception ex) {
            log.error("Failed to save weather data to L2 Cache (Database)", ex);
        }
    }

    /**
     * Automatically refresh cached entries.
     * Scheduled to run every 15 minutes.
     */
    @Scheduled(cron = "0 */15 * * * *")
    @Transactional
    public void refreshCacheAutomatically() {
        log.info("Starting automatic weather cache refresh background task.");
        LocalDateTime now = LocalDateTime.now();
        List<WeatherCache> activeCaches = cacheRepository.findAll();

        int refreshCount = 0;
        for (WeatherCache cache : activeCaches) {
            // Only refresh if cache is still active (not expired) or close to expiring (within next 15 minutes)
            if (cache.getExpiresAt().isAfter(now)) {
                String key = cache.getLocationKey();
                // Extrapolate city from location key (weather:city_name)
                String city = key.replace("weather:", "");

                try {
                    log.info("Background refreshing weather cache for: {}", city);
                    WeatherResponse freshResponse = weatherProvider.fetchWeather(city);
                    
                    int currentMonth = LocalDateTime.now().getMonthValue();
                    String season = SeasonDetector.detectSeason(freshResponse.getCountry(), currentMonth, freshResponse.getCondition());
                    freshResponse.setSeason(season);
                    freshResponse.setCached(false);

                    // Update L1 & L2 caches with fresh data and extended TTL
                    saveToL2Cache(key, freshResponse);
                    saveToL1Cache(key, freshResponse);
                    refreshCount++;
                } catch (Exception ex) {
                    log.error("Failed to background refresh weather cache for: {}", city, ex);
                }
            } else {
                // Remove expired cache from DB
                cacheRepository.delete(cache);
            }
        }
        log.info("Completed automatic weather cache refresh. Refreshed {} active keys.", refreshCount);
    }
}
