package com.outfit.recommendation.module.video.repository;

import com.outfit.recommendation.module.video.model.OutfitProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutfitProductRepository extends JpaRepository<OutfitProduct, UUID> {
    List<OutfitProduct> findByOutfitId(UUID outfitId);
    void deleteByOutfitId(UUID outfitId);

    @Modifying
    @Query("UPDATE OutfitProduct p SET p.clickCount = COALESCE(p.clickCount, 0) + 1 WHERE p.id = :id")
    void incrementClickCount(@Param("id") UUID id);

    @Query("SELECT COALESCE(SUM(p.clickCount), 0) FROM OutfitProduct p")
    Long getTotalClicks();
}
