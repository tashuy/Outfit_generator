package com.outfit.recommendation.module.analytics.controller;

import com.outfit.recommendation.module.analytics.dto.*;
import com.outfit.recommendation.module.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDashboardResponse> getDashboardSummary() {
        log.info("Admin request for analytics dashboard summary");
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/top-outfits")
    public ResponseEntity<List<TopOutfitDto>> getTopOutfits() {
        log.info("Admin request for top 10 outfits by views");
        return ResponseEntity.ok(analyticsService.getTopOutfits());
    }

    @GetMapping("/top-locations")
    public ResponseEntity<List<TopLocationDto>> getTopLocations() {
        log.info("Admin request for top location analytics");
        return ResponseEntity.ok(analyticsService.getTopLocations());
    }

    @GetMapping("/top-categories")
    public ResponseEntity<List<TopCategoryDto>> getTopCategories() {
        log.info("Admin request for top category analytics");
        return ResponseEntity.ok(analyticsService.getTopCategories());
    }
}
