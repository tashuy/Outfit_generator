package com.outfit.recommendation.module.weather.service;

import com.outfit.recommendation.module.weather.dto.WeatherResponse;

public interface WeatherProvider {
    /**
     * Fetches current weather details for a specific city.
     * Throws WeatherApiException if external service fails.
     * Throws InvalidLocationException if city is not found.
     */
    WeatherResponse fetchWeather(String city);
}
