package com.outfit.recommendation.module.weather.util;

import java.util.Set;

public class SeasonDetector {

    private static final Set<String> TROPICAL_MONSOON_COUNTRIES = Set.of("IN", "BD", "NP", "LK", "PK", "MM", "TH", "VN", "PH", "MY");
    private static final Set<String> SOUTHERN_HEMISPHERE_COUNTRIES = Set.of("AU", "NZ", "ZA", "BR", "AR");

    /**
     * Determines the season based on location (country code), month, and weather conditions.
     * Seasons: SUMMER, WINTER, MONSOON, SPRING, AUTUMN.
     */
    public static String detectSeason(String country, int month, String condition) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }

        String countryCode = country != null ? country.trim().toUpperCase() : "US";
        String normalizedCondition = condition != null ? condition.trim().toUpperCase() : "SUNNY";

        // Tropical monsoon countries logic
        if (TROPICAL_MONSOON_COUNTRIES.contains(countryCode)) {
            // Monsoon in India and South Asia runs from June to September.
            // Heavily reinforced if the current condition is RAINY or STORMY.
            if (month >= 6 && month <= 9) {
                return "MONSOON";
            }
            // If it's rainy or stormy in late May or early October, it's also monsoon-like.
            if ((month == 5 || month == 10) && (normalizedCondition.equals("RAINY") || normalizedCondition.equals("STORMY"))) {
                return "MONSOON";
            }
            
            // Other seasons for tropical subcontinent:
            // Winter: Dec, Jan, Feb
            if (month == 12 || month == 1 || month == 2) {
                return "WINTER";
            }
            // Spring: Mar, Apr
            if (month == 3 || month == 4) {
                return "SPRING";
            }
            // Summer: May
            if (month == 5) {
                return "SUMMER";
            }
            // Autumn: Oct, Nov
            return "AUTUMN";
        }

        // Southern Hemisphere countries logic
        if (SOUTHERN_HEMISPHERE_COUNTRIES.contains(countryCode)) {
            // Dec, Jan, Feb: Summer
            if (month == 12 || month == 1 || month == 2) {
                return "SUMMER";
            }
            // Mar, Apr, May: Autumn
            if (month == 3 || month == 4 || month == 5) {
                return "AUTUMN";
            }
            // Jun, Jul, Aug: Winter
            if (month == 6 || month == 7 || month == 8) {
                return "WINTER";
            }
            // Sep, Oct, Nov: Spring
            return "SPRING";
        }

        // Northern Hemisphere (Default) logic
        // Dec, Jan, Feb: Winter
        if (month == 12 || month == 1 || month == 2) {
            return "WINTER";
        }
        // Mar, Apr, May: Spring
        if (month == 3 || month == 4 || month == 5) {
            return "SPRING";
        }
        // Jun, Jul, Aug: Summer
        if (month == 6 || month == 7 || month == 8) {
            return "SUMMER";
        }
        // Sep, Oct, Nov: Autumn
        return "AUTUMN";
    }
}
