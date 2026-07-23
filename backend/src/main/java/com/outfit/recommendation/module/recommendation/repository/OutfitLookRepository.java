package com.outfit.recommendation.module.recommendation.repository;

import com.outfit.recommendation.module.recommendation.model.OutfitLook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OutfitLookRepository extends JpaRepository<OutfitLook, UUID> {
}
