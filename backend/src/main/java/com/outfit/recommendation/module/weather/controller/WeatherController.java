package com.outfit.recommendation.module.weather.controller;

import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import com.outfit.recommendation.module.weather.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    /**
     * GET /api/weather?city=
     * Returns the normalized weather response.
     */
    @GetMapping
    public ResponseEntity<WeatherResponse> getWeather(@RequestParam(required = false) String city) {
        log.info("Received request for weather for city: {}", city);
        validateCity(city);
        WeatherResponse response = weatherService.getWeather(city);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/weather/current?city=
     * Returns the normalized weather response.
     */
    @GetMapping("/current")
    public ResponseEntity<WeatherResponse> getCurrentWeather(@RequestParam(required = false) String city) {
        log.info("Received request for current weather for city: {}", city);
        validateCity(city);
        WeatherResponse response = weatherService.getWeather(city);
        return ResponseEntity.ok(response);
    }

    private void validateCity(String city) {
        if (city == null || city.trim().isEmpty()) {
            log.warn("Validation failed: City parameter is missing or empty.");
            throw new IllegalArgumentException("City is required");
        }
    }
}
