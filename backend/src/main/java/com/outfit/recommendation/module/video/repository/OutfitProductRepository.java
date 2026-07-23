package com.outfit.recommendation.module.video.repository;

import com.outfit.recommendation.module.video.model.OutfitProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutfitProductRepository extends JpaRepository<OutfitProduct, UUID> {
    List<OutfitProduct> findByOutfitId(UUID outfitId);
    void deleteByOutfitId(UUID outfitId);
}
