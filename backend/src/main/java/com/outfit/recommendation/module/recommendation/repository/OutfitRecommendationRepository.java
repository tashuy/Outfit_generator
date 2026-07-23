package com.outfit.recommendation.module.recommendation.repository;

import com.outfit.recommendation.module.recommendation.model.OutfitRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutfitRecommendationRepository extends JpaRepository<OutfitRecommendation, UUID> {
    List<OutfitRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
