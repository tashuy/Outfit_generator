package com.outfit.recommendation.module.recommendation.repository;

import com.outfit.recommendation.module.recommendation.model.SavedLook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedLookRepository extends JpaRepository<SavedLook, UUID> {
    List<SavedLook> findByUserIdOrderBySavedAtDesc(UUID userId);
    Optional<SavedLook> findByUserIdAndLookId(UUID userId, UUID lookId);
    boolean existsByUserIdAndLookId(UUID userId, UUID lookId);
}
