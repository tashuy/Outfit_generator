package com.outfit.recommendation.module.video.repository;

import com.outfit.recommendation.module.video.model.OutfitVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutfitVideoRepository extends JpaRepository<OutfitVideo, UUID> {

    @Query("SELECT DISTINCT o FROM OutfitVideo o JOIN o.locations l WHERE LOWER(l) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(:location) LIKE LOWER(CONCAT('%', l, '%')) ORDER BY o.createdAt DESC")
    List<OutfitVideo> findByLocationIgnoreCaseOrderByCreatedAtDesc(@Param("location") String location);

    @Query("SELECT DISTINCT o FROM OutfitVideo o JOIN o.categories c WHERE LOWER(c) = LOWER(:category) ORDER BY o.createdAt DESC")
    List<OutfitVideo> findByCategoryIgnoreCaseOrderByCreatedAtDesc(@Param("category") String category);

    @Query("SELECT DISTINCT o FROM OutfitVideo o LEFT JOIN o.locations l LEFT JOIN o.categories c WHERE LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY o.createdAt DESC")
    List<OutfitVideo> searchOutfits(@Param("query") String query);

    List<OutfitVideo> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE OutfitVideo o SET o.viewCount = COALESCE(o.viewCount, 0) + 1 WHERE o.id = :id")
    void incrementViewCount(@Param("id") UUID id);

    @Query("SELECT COALESCE(SUM(o.viewCount), 0) FROM OutfitVideo o")
    Long getTotalViews();

    List<OutfitVideo> findTop10ByOrderByViewCountDesc();

    @Query("SELECT l, SUM(COALESCE(o.viewCount, 0)) FROM OutfitVideo o JOIN o.locations l GROUP BY l ORDER BY SUM(COALESCE(o.viewCount, 0)) DESC")
    List<Object[]> getTopLocationsStats();

    @Query("SELECT c, SUM(COALESCE(o.viewCount, 0)) FROM OutfitVideo o JOIN o.categories c GROUP BY c ORDER BY SUM(COALESCE(o.viewCount, 0)) DESC")
    List<Object[]> getTopCategoriesStats();
}
