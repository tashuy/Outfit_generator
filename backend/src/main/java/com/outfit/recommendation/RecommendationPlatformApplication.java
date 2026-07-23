package com.outfit.recommendation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RecommendationPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecommendationPlatformApplication.class, args);
    }
}
