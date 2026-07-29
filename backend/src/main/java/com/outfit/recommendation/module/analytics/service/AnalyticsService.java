package com.outfit.recommendation.module.analytics.service;

import com.outfit.recommendation.module.analytics.dto.*;
import com.outfit.recommendation.module.video.model.OutfitProduct;
import com.outfit.recommendation.module.video.model.OutfitVideo;
import com.outfit.recommendation.module.video.repository.OutfitProductRepository;
import com.outfit.recommendation.module.video.repository.OutfitVideoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnalyticsService {

    private final OutfitVideoRepository outfitVideoRepository;
    private final OutfitProductRepository outfitProductRepository;

    @Autowired
    public AnalyticsService(OutfitVideoRepository outfitVideoRepository,
                            OutfitProductRepository outfitProductRepository) {
        this.outfitVideoRepository = outfitVideoRepository;
        this.outfitProductRepository = outfitProductRepository;
    }

    @Transactional
    public void recordOutfitView(UUID outfitId) {
        try {
            outfitVideoRepository.incrementViewCount(outfitId);
            log.debug("Incremented view count for outfit id={}", outfitId);
        } catch (Exception e) {
            log.error("Failed to increment view count for outfit id={}: {}", outfitId, e.getMessage());
        }
    }

    @Transactional
    public ProductClickResponse recordProductClick(UUID productId) {
        OutfitProduct product = outfitProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product link not found with ID: " + productId));

        outfitProductRepository.incrementClickCount(productId);
        log.info("Incremented click count for product id={}, title={}", productId, product.getProductName());

        Long updatedClicks = (product.getClickCount() != null ? product.getClickCount() : 0L) + 1;

        return ProductClickResponse.builder()
                .productId(product.getId())
                .productUrl(product.getProductUrl())
                .clickCount(updatedClicks)
                .build();
    }

    @Transactional(readOnly = true)
    public AnalyticsDashboardResponse getDashboardSummary() {
        Long totalViews = outfitVideoRepository.getTotalViews();
        Long totalProductClicks = outfitProductRepository.getTotalClicks();

        List<TopLocationDto> locations = getTopLocations();
        String topLocation = !locations.isEmpty() ? locations.get(0).getLocation() : "N/A";

        List<TopCategoryDto> categories = getTopCategories();
        String topCategory = !categories.isEmpty() ? categories.get(0).getCategory() : "N/A";

        List<TopOutfitDto> topOutfits = getTopOutfits();
        TopOutfitDto mostViewedOutfit = !topOutfits.isEmpty() ? topOutfits.get(0) : null;

        return AnalyticsDashboardResponse.builder()
                .totalViews(totalViews != null ? totalViews : 0L)
                .totalProductClicks(totalProductClicks != null ? totalProductClicks : 0L)
                .topLocation(topLocation)
                .topCategory(topCategory)
                .mostViewedOutfit(mostViewedOutfit)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TopOutfitDto> getTopOutfits() {
        List<OutfitVideo> topVideos = outfitVideoRepository.findTop10ByOrderByViewCountDesc();
        return topVideos.stream()
                .map(v -> TopOutfitDto.builder()
                        .id(v.getId())
                        .title(v.getTitle())
                        .location(v.getLocation())
                        .category(v.getCategory())
                        .views(v.getViewCount() != null ? v.getViewCount() : 0L)
                        .thumbnail(v.getMediaUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TopLocationDto> getTopLocations() {
        List<Object[]> rawStats = outfitVideoRepository.getTopLocationsStats();
        List<TopLocationDto> list = new ArrayList<>();
        for (Object[] row : rawStats) {
            if (row != null && row.length >= 2 && row[0] != null) {
                String loc = (String) row[0];
                Long views = ((Number) row[1]).longValue();
                list.add(new TopLocationDto(loc, views));
            }
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<TopCategoryDto> getTopCategories() {
        List<Object[]> rawStats = outfitVideoRepository.getTopCategoriesStats();
        List<TopCategoryDto> list = new ArrayList<>();
        for (Object[] row : rawStats) {
            if (row != null && row.length >= 2 && row[0] != null) {
                String cat = (String) row[0];
                Long views = ((Number) row[1]).longValue();
                list.add(new TopCategoryDto(cat, views));
            }
        }
        return list;
    }
}
