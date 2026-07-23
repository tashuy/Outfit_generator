package com.outfit.recommendation.module.video.controller;

import com.outfit.recommendation.module.video.dto.OutfitRequestDto;
import com.outfit.recommendation.module.video.dto.OutfitResponseDto;
import com.outfit.recommendation.module.video.service.OutfitVideoService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin/outfits")
public class AdminOutfitController {

    @Autowired
    private OutfitVideoService outfitVideoService;

    /**
     * POST /api/admin/outfits
     * Creates a new outfit with attached product links.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutfitResponseDto> createOutfit(
            @Valid @RequestBody OutfitRequestDto requestDto,
            Authentication authentication) {
        log.info("Admin request to create outfit: title={}, location={}", requestDto.getTitle(), requestDto.getLocation());
        String userEmail = authentication != null ? authentication.getName() : null;
        OutfitResponseDto created = outfitVideoService.createOutfit(requestDto, userEmail);
        return ResponseEntity.ok(created);
    }

    /**
     * PUT /api/admin/outfits/{id}
     * Updates an existing outfit and its product links.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutfitResponseDto> updateOutfit(
            @PathVariable UUID id,
            @Valid @RequestBody OutfitRequestDto requestDto) {
        log.info("Admin request to update outfit id={}", id);
        OutfitResponseDto updated = outfitVideoService.updateOutfit(id, requestDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/outfits/{id}
     * Deletes an outfit, removes its product links, and destroys its Cloudinary asset.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteOutfit(@PathVariable UUID id) {
        log.info("Admin request to delete outfit id={}", id);
        outfitVideoService.deleteOutfit(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Outfit deleted successfully");
        response.put("id", id.toString());
        return ResponseEntity.ok(response);
    }
}
