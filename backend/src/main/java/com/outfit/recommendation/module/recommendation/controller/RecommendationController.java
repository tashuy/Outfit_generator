package com.outfit.recommendation.module.recommendation.controller;

import com.outfit.recommendation.module.recommendation.dto.OutfitGenerationRequest;
import com.outfit.recommendation.module.recommendation.model.OutfitRecommendation;
import com.outfit.recommendation.module.recommendation.model.SavedLook;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.module.auth.service.AuthService;
import com.outfit.recommendation.module.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private AuthService authService;

    // Public endpoint for guest suggestions
    @PostMapping("/public/recommendations/generate")
    public ResponseEntity<OutfitRecommendation> generateGuestOutfit(@Valid @RequestBody OutfitGenerationRequest request) {
        OutfitRecommendation recommendation = recommendationService.generateRecommendation(request, null);
        return ResponseEntity.ok(recommendation);
    }

    // Authenticated endpoint for registered users
    @PostMapping("/recommendations/generate")
    public ResponseEntity<OutfitRecommendation> generateUserOutfit(@Valid @RequestBody OutfitGenerationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());

        OutfitRecommendation recommendation = recommendationService.generateRecommendation(request, user);

        // Save generation query to user's search history
        String searchQuery = String.format("%s look for %s in %s under %s", 
                request.getStyle(), request.getOccasion(), request.getLocation(), request.getBudget());
        authService.saveSearchQuery(user, searchQuery);

        return ResponseEntity.ok(recommendation);
    }

    @GetMapping("/recommendations/history")
    public ResponseEntity<List<OutfitRecommendation>> getRecommendationHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(recommendationService.getHistory(user));
    }

    @PostMapping("/recommendations/save-look/{lookId}")
    public ResponseEntity<SavedLook> saveLook(@PathVariable UUID lookId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(recommendationService.saveLook(user, lookId));
    }

    @DeleteMapping("/recommendations/unsave-look/{lookId}")
    public ResponseEntity<?> unsaveLook(@PathVariable UUID lookId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        recommendationService.unsaveLook(user, lookId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommendations/saved-looks")
    public ResponseEntity<List<SavedLook>> getSavedLooks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(recommendationService.getSavedLooks(user));
    }
}
