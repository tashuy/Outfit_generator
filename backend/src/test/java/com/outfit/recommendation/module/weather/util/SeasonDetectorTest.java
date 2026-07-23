package com.outfit.recommendation.module.weather.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SeasonDetectorTest {

    @Test
    public void testNorthernHemisphereSeasons() {
        // Winter: Dec, Jan, Feb
        assertEquals("WINTER", SeasonDetector.detectSeason("US", 12, "SUNNY"));
        assertEquals("WINTER", SeasonDetector.detectSeason("GB", 1, "CLOUDY"));
        assertEquals("WINTER", SeasonDetector.detectSeason("CA", 2, "SNOWY"));

        // Spring: Mar, Apr, May
        assertEquals("SPRING", SeasonDetector.detectSeason("US", 3, "SUNNY"));
        assertEquals("SPRING", SeasonDetector.detectSeason("FR", 4, "RAINY"));
        assertEquals("SPRING", SeasonDetector.detectSeason("DE", 5, "CLOUDY"));

        // Summer: Jun, Jul, Aug
        assertEquals("SUMMER", SeasonDetector.detectSeason("US", 6, "SUNNY"));
        assertEquals("SUMMER", SeasonDetector.detectSeason("IT", 7, "SUNNY"));
        assertEquals("SUMMER", SeasonDetector.detectSeason("ES", 8, "SUNNY"));

        // Autumn: Sep, Oct, Nov
        assertEquals("AUTUMN", SeasonDetector.detectSeason("US", 9, "CLOUDY"));
        assertEquals("AUTUMN", SeasonDetector.detectSeason("NL", 10, "RAINY"));
        assertEquals("AUTUMN", SeasonDetector.detectSeason("SE", 11, "FOGGY"));
    }

    @Test
    public void testSouthernHemisphereSeasons() {
        // Summer: Dec, Jan, Feb
        assertEquals("SUMMER", SeasonDetector.detectSeason("AU", 12, "SUNNY"));
        assertEquals("SUMMER", SeasonDetector.detectSeason("NZ", 1, "CLOUDY"));
        assertEquals("SUMMER", SeasonDetector.detectSeason("ZA", 2, "SUNNY"));

        // Autumn: Mar, Apr, May
        assertEquals("AUTUMN", SeasonDetector.detectSeason("AU", 3, "SUNNY"));
        assertEquals("AUTUMN", SeasonDetector.detectSeason("BR", 4, "RAINY"));
        assertEquals("AUTUMN", SeasonDetector.detectSeason("AR", 5, "CLOUDY"));

        // Winter: Jun, Jul, Aug
        assertEquals("WINTER", SeasonDetector.detectSeason("AU", 6, "SUNNY"));
        assertEquals("WINTER", SeasonDetector.detectSeason("ZA", 7, "RAINY"));
        assertEquals("WINTER", SeasonDetector.detectSeason("NZ", 8, "SNOWY"));

        // Spring: Sep, Oct, Nov
        assertEquals("SPRING", SeasonDetector.detectSeason("AU", 9, "CLOUDY"));
        assertEquals("SPRING", SeasonDetector.detectSeason("BR", 10, "SUNNY"));
        assertEquals("SPRING", SeasonDetector.detectSeason("AR", 11, "SUNNY"));
    }

    @Test
    public void testTropicalMonsoonSeasons() {
        // India (IN) specific logic
        // Monsoon: Jun, Jul, Aug, Sep
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 6, "RAINY"));
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 7, "STORMY"));
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 8, "CLOUDY"));
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 9, "SUNNY"));

        // Rain in May/Oct triggers Monsoon for tropical countries
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 5, "RAINY"));
        assertEquals("MONSOON", SeasonDetector.detectSeason("IN", 10, "STORMY"));
        // No rain in May/Oct defaults to Summer/Autumn respectively
        assertEquals("SUMMER", SeasonDetector.detectSeason("IN", 5, "SUNNY"));
        assertEquals("AUTUMN", SeasonDetector.detectSeason("IN", 10, "SUNNY"));

        // Winter: Dec, Jan, Feb
        assertEquals("WINTER", SeasonDetector.detectSeason("IN", 1, "SUNNY"));
        // Spring: Mar, Apr
        assertEquals("SPRING", SeasonDetector.detectSeason("IN", 3, "SUNNY"));
    }

    @Test
    public void testInvalidMonth() {
        assertThrows(IllegalArgumentException.class, () -> {
            SeasonDetector.detectSeason("US", 13, "SUNNY");
        });
        assertThrows(IllegalArgumentException.class, () -> {
            SeasonDetector.detectSeason("US", 0, "SUNNY");
        });
    }
}
