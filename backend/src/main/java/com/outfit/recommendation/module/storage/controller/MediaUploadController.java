package com.outfit.recommendation.module.storage.controller;

import com.outfit.recommendation.module.storage.dto.MediaUploadResponse;
import com.outfit.recommendation.module.storage.service.CloudinaryStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/media")
public class MediaUploadController {

    @Autowired
    private CloudinaryStorageService cloudinaryStorageService;

    /**
     * POST /api/admin/media/upload
     * Uploads image or video directly to Cloudinary and returns media details.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MediaUploadResponse> uploadMedia(@RequestParam("file") MultipartFile file) {
        log.info("Admin media upload request received: filename={}, size={}", file.getOriginalFilename(), file.getSize());
        MediaUploadResponse response = cloudinaryStorageService.uploadMedia(file);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/admin/media?publicId=
     * Removes asset from Cloudinary using publicId.
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteMedia(@RequestParam("publicId") String publicId) {
        log.info("Admin media delete request received for publicId: {}", publicId);
        cloudinaryStorageService.deleteAsset(publicId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Media asset deleted successfully");
        response.put("publicId", publicId);
        return ResponseEntity.ok(response);
    }
}
