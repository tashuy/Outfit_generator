package com.outfit.recommendation.module.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDashboardResponse {
    private Long totalViews;
    private Long totalProductClicks;
    private String topLocation;
    private String topCategory;
    private TopOutfitDto mostViewedOutfit;
}
