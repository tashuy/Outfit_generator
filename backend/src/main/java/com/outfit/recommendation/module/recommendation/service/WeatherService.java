package com.outfit.recommendation.module.recommendation.service;

import com.outfit.recommendation.module.recommendation.dto.WeatherResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service("recommendationWeatherService")
public class WeatherService {

    @Cacheable(value = "weather", key = "#location.trim().toLowerCase()")
    public WeatherResponse getWeather(String location) {
        String loc = location != null ? location.trim().toLowerCase(Locale.ROOT) : "default";
        
        Double temp;
        Double humidity;
        String season;
        Double rainProb;
        String advice;

        if (loc.contains("bangalore") || loc.contains("bengaluru")) {
            temp = 22.5;
            humidity = 60.0;
            season = "Pleasant";
            rainProb = 20.0;
            advice = "Perfect weather. Light layers, hoodies, cottons, or denim jackets work beautifully here.";
        } else if (loc.contains("mumbai") || loc.contains("goa") || loc.contains("chennai")) {
            temp = 29.0;
            humidity = 85.0;
            season = "Humid Summer / Monsoon";
            rainProb = 75.0;
            advice = "High humidity and rain risk. Avoid white shoes and heavy fabrics. Choose lightweight, quick-dry cotton, shorts, or linen.";
        } else if (loc.contains("delhi") || loc.contains("indore") || loc.contains("jaipur") || loc.contains("rajasthan")) {
            temp = 38.5;
            humidity = 35.0;
            season = "Hot Summer";
            rainProb = 5.0;
            advice = "Very hot. Recommend extremely breathable linen, loose cotton t-shirts, light-colored clothing, and sunglasses.";
        } else if (loc.contains("shimla") || loc.contains("manali") || loc.contains("kashmir") || loc.contains("himalaya")) {
            temp = 12.0;
            humidity = 50.0;
            season = "Cold Winter";
            rainProb = 10.0;
            advice = "Cold. Recommend heavy layering, sweaters, jackets, woolens, and leather boots.";
        } else {
            // Default response
            temp = 25.0;
            humidity = 50.0;
            season = "Moderate";
            rainProb = 15.0;
            advice = "Moderate temperature. Casual cotton shirts, light denim, and sneakers are recommended.";
        }

        return WeatherResponse.builder()
                .temperature(temp)
                .humidity(humidity)
                .season(season)
                .rainProbability(rainProb)
                .advice(advice)
                .build();
    }
}
