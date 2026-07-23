package com.outfit.recommendation.module.video.repository;

import com.outfit.recommendation.module.video.model.OutfitVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutfitVideoRepository extends JpaRepository<OutfitVideo, UUID> {

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM OutfitVideo o JOIN o.locations l WHERE LOWER(l) = LOWER(:location) ORDER BY o.createdAt DESC")
    List<OutfitVideo> findByLocationIgnoreCaseOrderByCreatedAtDesc(@org.springframework.data.repository.query.Param("location") String location);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM OutfitVideo o JOIN o.categories c WHERE LOWER(c) = LOWER(:category) ORDER BY o.createdAt DESC")
    List<OutfitVideo> findByCategoryIgnoreCaseOrderByCreatedAtDesc(@org.springframework.data.repository.query.Param("category") String category);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM OutfitVideo o LEFT JOIN o.locations l LEFT JOIN o.categories c WHERE LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY o.createdAt DESC")
    List<OutfitVideo> searchOutfits(@org.springframework.data.repository.query.Param("query") String query);

    List<OutfitVideo> findAllByOrderByCreatedAtDesc();
}
