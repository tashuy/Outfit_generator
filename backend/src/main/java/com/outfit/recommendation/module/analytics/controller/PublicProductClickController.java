package com.outfit.recommendation.module.analytics.controller;

import com.outfit.recommendation.module.analytics.dto.ProductClickResponse;
import com.outfit.recommendation.module.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/public/products")
public class PublicProductClickController {

    private final AnalyticsService analyticsService;

    @Autowired
    public PublicProductClickController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/{id}/click")
    public ResponseEntity<ProductClickResponse> trackProductClick(@PathVariable UUID id) {
        log.info("Public product link click tracking received for product id={}", id);
        ProductClickResponse response = analyticsService.recordProductClick(id);
        return ResponseEntity.ok(response);
    }
}
