package com.outfit.recommendation.module.video.controller;

import com.outfit.recommendation.module.video.dto.OutfitResponseDto;
import com.outfit.recommendation.module.video.model.OutfitVideo;
import com.outfit.recommendation.module.video.service.OutfitVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OutfitVideoController {

    @Autowired
    private OutfitVideoService outfitVideoService;

    // Public list/search endpoints
    @GetMapping("/public/videos")
    public ResponseEntity<List<OutfitResponseDto>> getAllOutfits() {
        return ResponseEntity.ok(outfitVideoService.getAllOutfits());
    }

    @GetMapping("/public/videos/{id}")
    public ResponseEntity<OutfitResponseDto> getOutfitById(@PathVariable UUID id) {
        return ResponseEntity.ok(outfitVideoService.getOutfitById(id));
    }

    @GetMapping("/public/videos/category/{category}")
    public ResponseEntity<List<OutfitResponseDto>> getOutfitsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(outfitVideoService.getOutfitsByCategory(category));
    }

    @GetMapping("/public/videos/location/{location}")
    public ResponseEntity<List<OutfitResponseDto>> getOutfitsByLocationPath(@PathVariable String location) {
        return ResponseEntity.ok(outfitVideoService.getOutfitsByLocation(location));
    }

    @GetMapping("/public/videos/search")
    public ResponseEntity<List<OutfitResponseDto>> getVideosByLocation(@RequestParam String location) {
        return ResponseEntity.ok(outfitVideoService.getOutfitsByLocation(location));
    }

    // Authenticated upload endpoint (ADMIN only)
    @PostMapping("/videos/upload")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutfitVideo> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam(value = "occasion", required = false) String occasion,
            @RequestParam(value = "style", required = false) String style,
            Authentication authentication) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String userEmail = (authentication != null) ? authentication.getName() : null;
            OutfitVideo saved = outfitVideoService.saveVideo(file, title, description, location, occasion, style, userEmail);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
