package com.outfit.recommendation.module.weather.controller;

import com.outfit.recommendation.config.JwtTokenProvider;
import com.outfit.recommendation.module.auth.service.CustomUserDetailsService;
import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import com.outfit.recommendation.module.weather.exception.InvalidLocationException;
import com.outfit.recommendation.module.weather.exception.WeatherApiException;
import com.outfit.recommendation.module.weather.service.WeatherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WeatherController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters to easily test request/response mapping
public class WeatherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    // Security beans that are required to load the context
    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private WeatherResponse mockResponse;

    @BeforeEach
    public void setUp() {
        mockResponse = WeatherResponse.builder()
                .city("Bangalore")
                .country("IN")
                .temperature(27.5)
                .feelsLike(29.0)
                .humidity(65)
                .windSpeed(3.5)
                .condition("SUNNY")
                .season("MONSOON")
                .cached(false)
                .build();
    }

    @Test
    public void shouldReturnWeatherSuccessfully() throws Exception {
        Mockito.when(weatherService.getWeather("Bangalore")).thenReturn(mockResponse);

        mockMvc.perform(get("/api/weather")
                .param("city", "Bangalore")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Bangalore"))
                .andExpect(jsonPath("$.country").value("IN"))
                .andExpect(jsonPath("$.temperature").value(27.5))
                .andExpect(jsonPath("$.condition").value("SUNNY"))
                .andExpect(jsonPath("$.season").value("MONSOON"))
                .andExpect(jsonPath("$.cached").value(false));
    }

    @Test
    public void shouldReturnCurrentWeatherSuccessfully() throws Exception {
        Mockito.when(weatherService.getWeather("Bangalore")).thenReturn(mockResponse);

        mockMvc.perform(get("/api/weather/current")
                .param("city", "Bangalore")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Bangalore"))
                .andExpect(jsonPath("$.cached").value(false));
    }

    @Test
    public void shouldFailWhenCityIsMissing() throws Exception {
        mockMvc.perform(get("/api/weather")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("City is required"));
    }

    @Test
    public void shouldFailWhenCityIsEmpty() throws Exception {
        mockMvc.perform(get("/api/weather")
                .param("city", "   ")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("City is required"));
    }

    @Test
    public void shouldHandleInvalidLocationException() throws Exception {
        Mockito.when(weatherService.getWeather("InvalidCity"))
                .thenThrow(new InvalidLocationException("City not found: InvalidCity"));

        mockMvc.perform(get("/api/weather")
                .param("city", "InvalidCity")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("City not found: InvalidCity"));
    }

    @Test
    public void shouldHandleWeatherApiException() throws Exception {
        Mockito.when(weatherService.getWeather("Bangalore"))
                .thenThrow(new WeatherApiException("Weather API timeout or connection failure"));

        mockMvc.perform(get("/api/weather")
                .param("city", "Bangalore")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.error").value("Bad Gateway"))
                .andExpect(jsonPath("$.message").value("Weather API timeout or connection failure"));
    }
}
