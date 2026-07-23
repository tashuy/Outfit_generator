package com.outfit.recommendation.module.weather.service;

import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import com.outfit.recommendation.module.weather.exception.InvalidLocationException;
import com.outfit.recommendation.module.weather.exception.WeatherApiException;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class OpenWeatherProvider implements WeatherProvider {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public OpenWeatherProvider(
            @Value("${weather.api-key:}") String apiKey,
            @Value("${weather.base-url:https://api.openweathermap.org/data/2.5}") String baseUrl) {
        this.restTemplate = new RestTemplate();
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    @Override
    public WeatherResponse fetchWeather(String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidLocationException("City cannot be empty");
        }

        // Fallback for local development or testing if API key is not configured
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("mock") || apiKey.contains("WEATHER_API_KEY")) {
            log.warn("Weather API Key is not configured. Returning mock weather data for: {}", city);
            return getMockWeather(city);
        }

        try {
            String url = String.format("%s/weather?q=%s&appid=%s&units=metric", baseUrl, city.trim(), apiKey);
            OpenWeatherMapResponse response = restTemplate.getForObject(url, OpenWeatherMapResponse.class);

            if (response == null || response.getWeather() == null || response.getWeather().length == 0) {
                throw new WeatherApiException("Empty or invalid response from weather API");
            }

            Double temp = response.getMain() != null ? response.getMain().getTemp() : 20.0;
            Double feelsLike = response.getMain() != null ? response.getMain().getFeels_like() : temp;
            Integer humidity = response.getMain() != null ? response.getMain().getHumidity() : 50;
            Double windSpeed = response.getWind() != null ? response.getWind().getSpeed() : 2.0;
            String country = response.getSys() != null ? response.getSys().getCountry() : "Unknown";

            String mainCondition = response.getWeather()[0].getMain();
            String normalizedCondition = normalizeCondition(mainCondition, windSpeed);

            // Estimate rain probability (OpenWeatherMap current weather does not return pop, so we estimate)
            double rainProb = 0.0;
            if (normalizedCondition.equals("RAINY")) {
                rainProb = 85.0;
            } else if (normalizedCondition.equals("STORMY")) {
                rainProb = 95.0;
            } else if (normalizedCondition.equals("CLOUDY")) {
                rainProb = 20.0;
            }

            return WeatherResponse.builder()
                    .city(response.getName() != null ? response.getName() : city)
                    .country(country)
                    .temperature(temp)
                    .feelsLike(feelsLike)
                    .humidity(humidity)
                    .windSpeed(windSpeed)
                    .condition(normalizedCondition)
                    .cached(false)
                    .build();

        } catch (HttpClientErrorException.NotFound ex) {
            log.error("City not found: {}", city, ex);
            throw new InvalidLocationException("City not found: " + city);
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.error("HTTP error from Weather API for city: {}", city, ex);
            throw new WeatherApiException("Weather API error: " + ex.getMessage(), ex);
        } catch (ResourceAccessException ex) {
            log.error("Connection timeout or failure connecting to Weather API for city: {}", city, ex);
            throw new WeatherApiException("Weather API timeout or connection failure", ex);
        } catch (Exception ex) {
            log.error("Unexpected error fetching weather for city: {}", city, ex);
            throw new WeatherApiException("Unexpected weather retrieval error: " + ex.getMessage(), ex);
        }
    }

    private String normalizeCondition(String mainCondition, Double windSpeed) {
        if (windSpeed != null && windSpeed > 12.0) {
            return "WINDY";
        }
        if (mainCondition == null) {
            return "SUNNY";
        }
        switch (mainCondition.toUpperCase()) {
            case "CLEAR":
                return "SUNNY";
            case "CLOUDS":
                return "CLOUDY";
            case "RAIN":
            case "DRIZZLE":
                return "RAINY";
            case "THUNDERSTORM":
                return "STORMY";
            case "SNOW":
                return "SNOWY";
            case "MIST":
            case "SMOKE":
            case "HAZE":
            case "DUST":
            case "FOG":
            case "SAND":
            case "ASH":
            case "SQUALL":
            case "TORNADO":
                return "FOGGY";
            default:
                return "SUNNY";
        }
    }

    private WeatherResponse getMockWeather(String city) {
        String normalizedCity = city.trim().toLowerCase();
        String country = "IN";
        double temp = 27.5;
        double feelsLike = 29.0;
        int humidity = 65;
        double wind = 3.5;
        String condition = "SUNNY";

        if (normalizedCity.contains("london")) {
            country = "GB";
            temp = 15.0;
            feelsLike = 14.0;
            humidity = 80;
            wind = 5.0;
            condition = "CLOUDY";
        } else if (normalizedCity.contains("sydney")) {
            country = "AU";
            temp = 18.0;
            feelsLike = 18.0;
            humidity = 55;
            wind = 6.2;
            condition = "SUNNY";
        } else if (normalizedCity.contains("mumbai") || normalizedCity.contains("bangalore") || normalizedCity.contains("bengaluru")) {
            country = "IN";
            temp = 28.0;
            feelsLike = 32.0;
            humidity = 85;
            wind = 4.5;
            condition = "RAINY";
        } else if (normalizedCity.contains("moscow")) {
            country = "RU";
            temp = -5.0;
            feelsLike = -9.0;
            humidity = 90;
            wind = 7.0;
            condition = "SNOWY";
        }

        return WeatherResponse.builder()
                .city(city)
                .country(country)
                .temperature(temp)
                .feelsLike(feelsLike)
                .humidity(humidity)
                .windSpeed(wind)
                .condition(condition)
                .cached(false)
                .build();
    }

    // OpenWeatherMap API mapping classes
    @Data
    @NoArgsConstructor
    private static class OpenWeatherMapResponse {
        private String name;
        private Main main;
        private Sys sys;
        private Wind wind;
        private Weather[] weather;
    }

    @Data
    @NoArgsConstructor
    private static class Main {
        private Double temp;
        private Double feels_like;
        private Integer humidity;
    }

    @Data
    @NoArgsConstructor
    private static class Sys {
        private String country;
    }

    @Data
    @NoArgsConstructor
    private static class Wind {
        private Double speed;
    }

    @Data
    @NoArgsConstructor
    private static class Weather {
        private String main;
        private String description;
    }
}
