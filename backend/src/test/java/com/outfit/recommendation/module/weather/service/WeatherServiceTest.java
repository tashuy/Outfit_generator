package com.outfit.recommendation.module.weather.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import com.outfit.recommendation.module.weather.model.WeatherCache;
import com.outfit.recommendation.module.weather.repository.WeatherCacheRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WeatherServiceTest {

    @Mock
    private WeatherProvider weatherProvider;

    @Mock
    private WeatherCacheRepository cacheRepository;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private WeatherService weatherService;

    private WeatherResponse mockResponse;
    private String cacheKey;

    @BeforeEach
    public void setUp() {
        mockResponse = WeatherResponse.builder()
                .city("Bangalore")
                .country("IN")
                .temperature(25.0)
                .feelsLike(27.0)
                .humidity(60)
                .windSpeed(4.0)
                .condition("SUNNY")
                .season("MONSOON")
                .cached(false)
                .build();

        cacheKey = "weather:bangalore";
    }

    @Test
    public void shouldReturnFromL1CacheOnHit() throws Exception {
        // Mock Redis L1 hit
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        String jsonStr = objectMapper.writeValueAsString(mockResponse);
        when(valueOperations.get(cacheKey)).thenReturn(jsonStr);

        WeatherResponse result = weatherService.getWeather("Bangalore");

        assertNotNull(result);
        assertTrue(result.getCached());
        assertEquals("Bangalore", result.getCity());
        assertEquals(25.0, result.getTemperature());

        // Verify no DB or API calls
        verifyNoInteractions(cacheRepository);
        verifyNoInteractions(weatherProvider);
    }

    @Test
    public void shouldReturnFromL2CacheOnL1MissAndL2Hit() throws Exception {
        // Mock L1 miss
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(cacheKey)).thenReturn(null);

        // Mock L2 hit
        WeatherResponse dbStoredResponse = WeatherResponse.builder()
                .city("Bangalore")
                .country("IN")
                .temperature(25.0)
                .feelsLike(27.0)
                .humidity(60)
                .windSpeed(4.0)
                .condition("SUNNY")
                .season("MONSOON")
                .cached(true)
                .build();
        String jsonStr = objectMapper.writeValueAsString(dbStoredResponse);
        WeatherCache weatherCache = WeatherCache.builder()
                .locationKey(cacheKey)
                .weatherData(jsonStr)
                .createdAt(LocalDateTime.now().minusMinutes(10))
                .expiresAt(LocalDateTime.now().plusMinutes(20))
                .build();
        when(cacheRepository.findByLocationKey(cacheKey)).thenReturn(Optional.of(weatherCache));

        WeatherResponse result = weatherService.getWeather("Bangalore");

        assertNotNull(result);
        assertTrue(result.getCached());
        assertEquals("Bangalore", result.getCity());

        // Should repopulate L1 cache
        verify(valueOperations).set(eq(cacheKey), anyString(), eq(30L), eq(TimeUnit.MINUTES));
        // Verify no API calls
        verifyNoInteractions(weatherProvider);
    }

    @Test
    public void shouldCallExternalApiOnL1AndL2Miss() throws Exception {
        // Mock L1 miss
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(cacheKey)).thenReturn(null);

        // Mock L2 miss
        when(cacheRepository.findByLocationKey(cacheKey)).thenReturn(Optional.empty());

        // Mock API call
        when(weatherProvider.fetchWeather("Bangalore")).thenReturn(mockResponse);

        WeatherResponse result = weatherService.getWeather("Bangalore");

        assertNotNull(result);
        assertFalse(result.getCached());
        assertEquals("Bangalore", result.getCity());
        assertNotNull(result.getSeason()); // dynamic season detected

        // Verify save to L1 & L2 cache
        verify(cacheRepository).save(any(WeatherCache.class));
        verify(valueOperations).set(eq(cacheKey), anyString(), eq(30L), eq(TimeUnit.MINUTES));
    }

    @Test
    public void shouldCallExternalApiOnExpiredL2Cache() throws Exception {
        // Mock L1 miss
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(cacheKey)).thenReturn(null);

        // Mock L2 expired hit
        WeatherCache expiredCache = WeatherCache.builder()
                .locationKey(cacheKey)
                .weatherData("{}")
                .createdAt(LocalDateTime.now().minusMinutes(40))
                .expiresAt(LocalDateTime.now().minusMinutes(10))
                .build();
        when(cacheRepository.findByLocationKey(cacheKey))
                .thenReturn(Optional.of(expiredCache))
                .thenReturn(Optional.empty());

        // Mock API call
        when(weatherProvider.fetchWeather("Bangalore")).thenReturn(mockResponse);

        WeatherResponse result = weatherService.getWeather("Bangalore");

        assertNotNull(result);
        assertFalse(result.getCached());
        
        // Expired record should be deleted
        verify(cacheRepository).delete(expiredCache);
        // Clean save should occur
        verify(cacheRepository).save(any(WeatherCache.class));
    }

    @Test
    public void shouldHandleRedisCacheReadFailureGracefully() throws Exception {
        // Mock Redis lookup throws exception
        when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis connection failure"));

        // Mock L2 miss
        when(cacheRepository.findByLocationKey(cacheKey)).thenReturn(Optional.empty());
        // Mock API call
        when(weatherProvider.fetchWeather("Bangalore")).thenReturn(mockResponse);

        // Should not throw, should succeed by falling back
        WeatherResponse result = weatherService.getWeather("Bangalore");

        assertNotNull(result);
        assertFalse(result.getCached());
        assertEquals("Bangalore", result.getCity());
    }

    @Test
    public void shouldRefreshCacheForActiveKeys() throws Exception {
        // Mock L2 having an active key
        WeatherCache activeCache = WeatherCache.builder()
                .locationKey(cacheKey)
                .weatherData(objectMapper.writeValueAsString(mockResponse))
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .expiresAt(LocalDateTime.now().plusMinutes(25))
                .build();
        when(cacheRepository.findAll()).thenReturn(Collections.singletonList(activeCache));
        
        // Mock API call during background refresh
        when(weatherProvider.fetchWeather("bangalore")).thenReturn(mockResponse);

        // Run automatic refresh
        weatherService.refreshCacheAutomatically();

        // Verify API was called to update it
        verify(weatherProvider).fetchWeather("bangalore");
        // Verify update to caches happened
        verify(cacheRepository).save(any(WeatherCache.class));
    }
}
