package com.outfit.recommendation.module.recommendation.service;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.module.marketplace.model.Product;
import com.outfit.recommendation.module.recommendation.model.OutfitLook;
import com.outfit.recommendation.module.recommendation.model.OutfitRecommendation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.outfit.recommendation.module.recommendation.dto.OutfitGenerationRequest;
import com.outfit.recommendation.module.recommendation.dto.WeatherResponse;
import com.outfit.recommendation.shared.model.*;
import com.outfit.recommendation.module.video.model.*;
import com.outfit.recommendation.module.recommendation.model.*;
import com.outfit.recommendation.module.marketplace.model.*;
import com.outfit.recommendation.module.recommendation.repository.OutfitLookRepository;
import com.outfit.recommendation.module.recommendation.repository.OutfitRecommendationRepository;
import com.outfit.recommendation.module.recommendation.repository.SavedLookRepository;
import com.outfit.recommendation.module.marketplace.service.adapter.MarketplaceAdapter;
import com.outfit.recommendation.module.recommendation.service.RuleEngine;
import com.outfit.recommendation.module.recommendation.service.RankingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private MarketplaceAdapter marketplaceAdapter;

    @Autowired
    private OutfitRecommendationRepository recommendationRepository;

    @Autowired
    private OutfitLookRepository lookRepository;

    @Autowired
    private SavedLookRepository savedLookRepository;

    @Autowired
    private RuleEngine ruleEngine;

    @Autowired
    private RankingService rankingService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public OutfitRecommendation generateRecommendation(OutfitGenerationRequest request, User user) {
        log.info("Generating outfit recommendations for: occasion={}, budget={}, style={}, gender={}, location={}",
                request.getOccasion(), request.getBudget(), request.getStyle(), request.getGender(), request.getLocation());

        // 1. Fetch Weather
        WeatherResponse weather = weatherService.getWeather(request.getLocation());
        String weatherStr = String.format("%s, %.1f°C", weather.getSeason(), weather.getTemperature());

        // 2. Query Styling Engine (Gemini / fallback)
        String jsonResponse = geminiService.generateOutfitSuggestion(request, weather);

        // 3. Parse suggestions
        OutfitRecommendation recommendation = OutfitRecommendation.builder()
                .occasion(request.getOccasion())
                .budget(request.getBudget())
                .style(request.getStyle())
                .gender(request.getGender())
                .location(request.getLocation())
                .weatherInfo(weatherStr)
                .user(user)
                .build();

        double maxBudget = ruleEngine.parseMaxBudget(request.getBudget());

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            recommendation.setExplanation(root.path("explanation").asText());
            recommendation.setSuitabilityScore(root.path("suitabilityScore").asDouble(9.5));
            recommendation.setOverallScore(root.path("overallScore").asDouble(95.0));
            recommendation.setWeatherScore(root.path("weatherScore").asDouble(20.0));

            JsonNode looksNode = root.path("looks");
            List<OutfitLook> looks = new ArrayList<>();

            if (looksNode.isArray()) {
                for (JsonNode lookNode : looksNode) {
                    OutfitLook look = OutfitLook.builder()
                            .recommendation(recommendation)
                            .lookName(lookNode.path("lookName").asText("Suggested Look"))
                            .stylingNotes(lookNode.path("stylingNotes").asText())
                            .lookScore(lookNode.path("lookScore").asDouble(95.0))
                            .fashionScore(lookNode.path("fashionScore").asDouble(19.0))
                            .colorScore(lookNode.path("colorScore").asDouble(10.0))
                            .fabricScore(lookNode.path("fabricScore").asDouble(10.0))
                            .budgetScore(lookNode.path("budgetScore").asDouble(10.0))
                            .occasionScore(lookNode.path("occasionScore").asDouble(10.0))
                            .build();

                    JsonNode itemsNode = lookNode.path("items");
                    List<OutfitItem> items = new ArrayList<>();

                    List<List<Product>> allItemsCandidates = new ArrayList<>();
                    List<String> categories = new ArrayList<>();
                    List<String> descriptions = new ArrayList<>();

                    if (itemsNode.isArray()) {
                        for (JsonNode itemNode : itemsNode) {
                            String category = itemNode.path("category").asText();
                            String description = itemNode.path("description").asText();
                            
                            categories.add(category);
                            descriptions.add(description);

                            // Get top candidates sorted by rating/price with look-level budget filter
                            List<Product> candidates = marketplaceAdapter.fetchProducts(description, request.getBudget());
                            // Sort by price ascending if budget is low to prioritize cheap alternatives in candidates list
                            if (maxBudget <= 2000.0) {
                                candidates.sort(java.util.Comparator.comparingDouble(Product::getPrice));
                            }
                            // Limit to top 3 candidates to avoid combinatorial explosion (3^4 = 81 combinations max)
                            List<Product> limitedCandidates = candidates.stream().limit(3).toList();
                            allItemsCandidates.add(limitedCandidates);
                        }
                    }

                    // Find the best combination of products where total look cost is under the budget
                    RankingService.CombinationResult bestCombo = rankingService.getBestCombination(allItemsCandidates, maxBudget);

                    // Build the look items using the selected combination
                    for (int i = 0; i < categories.size(); i++) {
                        Product matchedProduct = (bestCombo.products != null && i < bestCombo.products.size()) ? bestCombo.products.get(i) : null;
                        OutfitItem item = OutfitItem.builder()
                                .look(look)
                                .category(categories.get(i))
                                .description(descriptions.get(i))
                                .matchedProduct(matchedProduct)
                                .build();
                        items.add(item);
                    }

                    look.setItems(items);
                    look.setTotalCost(bestCombo.totalCost != Double.MAX_VALUE ? bestCombo.totalCost : 0.0);
                    looks.add(look);
                }
            }
            recommendation.setLooks(looks);
        } catch (Exception e) {
            log.error("Failed to parse Gemini styling JSON: {}. Building simple manual recommendation list.", e.getMessage());
            // Fallback layout in case JSON parser fails
            recommendation.setExplanation("Here are standard suggestions based on weather and styling inputs.");
            recommendation.setSuitabilityScore(8.0);
        }

        return recommendationRepository.save(recommendation);
    }

    public List<OutfitRecommendation> getHistory(User user) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public SavedLook saveLook(User user, UUID lookId) {
        OutfitLook look = lookRepository.findById(lookId)
                .orElseThrow(() -> new IllegalArgumentException("Look not found with ID: " + lookId));
        
        if (savedLookRepository.existsByUserIdAndLookId(user.getId(), lookId)) {
            return savedLookRepository.findByUserIdAndLookId(user.getId(), lookId).orElse(null);
        }

        SavedLook savedLook = SavedLook.builder()
                .user(user)
                .look(look)
                .build();
        return savedLookRepository.save(savedLook);
    }

    @Transactional
    public void unsaveLook(User user, UUID lookId) {
        SavedLook savedLook = savedLookRepository.findByUserIdAndLookId(user.getId(), lookId)
                .orElseThrow(() -> new IllegalArgumentException("Saved look not found"));
        savedLookRepository.delete(savedLook);
    }

    public List<SavedLook> getSavedLooks(User user) {
        return savedLookRepository.findByUserIdOrderBySavedAtDesc(user.getId());
    }
}
