package com.outfit.recommendation.module.storage.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.outfit.recommendation.module.storage.dto.MediaUploadResponse;
import com.outfit.recommendation.module.storage.model.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service("cloudinaryStorageService")
public class CloudinaryStorageService implements StorageService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_VIDEO_EXTENSIONS = Set.of("mp4", "webm", "mov");

    @Override
    public String store(MultipartFile file) {
        MediaUploadResponse response = uploadMedia(file);
        return response.getMediaUrl();
    }

    @Override
    public void delete(String publicIdOrUrl) {
        if (publicIdOrUrl == null || publicIdOrUrl.trim().isEmpty()) {
            return;
        }
        deleteAsset(publicIdOrUrl);
    }

    @Autowired
    private LocalStorageService localStorageService;

    public MediaUploadResponse uploadMedia(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        MediaType mediaType = determineMediaType(extension);

        validateFile(file, extension, mediaType);

        // Fallback for local development: Store and serve the user's ACTUAL original uploaded file
        if (isMockMode()) {
            log.info("Cloudinary credentials not configured. Storing original user file locally: {}", originalFilename);
            String localPath = localStorageService.store(file);
            String normalizedBackendUrl = backendUrl != null ? backendUrl.replaceAll("/+$", "") : "http://localhost:8080";
            String mediaUrl = normalizedBackendUrl + localPath;
            String publicId = localPath.replace("/uploads/", "");

            return MediaUploadResponse.builder()
                    .mediaUrl(mediaUrl)
                    .publicId(publicId)
                    .mediaType(mediaType)
                    .format(extension)
                    .sizeBytes(file.getSize())
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        try {
            String resourceType = (mediaType == MediaType.VIDEO) ? "video" : "image";
            Map params = ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "outfit_platform"
            );

            // Upload direct from memory stream (no local disk storage)
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            String mediaUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            String format = (String) uploadResult.get("format");
            Long bytes = ((Number) uploadResult.get("bytes")).longValue();

            return MediaUploadResponse.builder()
                    .mediaUrl(mediaUrl)
                    .publicId(publicId)
                    .mediaType(mediaType)
                    .format(format != null ? format : extension)
                    .sizeBytes(bytes != null ? bytes : file.getSize())
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: {}", originalFilename, e);
            throw new RuntimeException("Media upload to Cloudinary failed: " + e.getMessage(), e);
        }
    }

    public void deleteAsset(String publicId) {
        if (publicId == null || publicId.trim().isEmpty()) {
            return;
        }

        if (isMockMode()) {
            log.info("Mock mode: Deleting local asset for publicId: {}", publicId);
            localStorageService.delete(publicId.startsWith("/uploads/") ? publicId : "/uploads/" + publicId);
            return;
        }

        try {
            // Attempt deletion as image first, then as video if not found
            Map imageResult = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
            if ("not_found".equals(imageResult.get("result"))) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "video"));
            }
            log.info("Successfully deleted Cloudinary asset with publicId: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete Cloudinary asset for publicId: {}", publicId, e);
        }
    }

    private void validateFile(MultipartFile file, String extension, MediaType mediaType) {
        if (mediaType == MediaType.IMAGE) {
            if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
                throw new IllegalArgumentException("Unsupported image format. Allowed formats: " + ALLOWED_IMAGE_EXTENSIONS);
            }
            if (file.getSize() > MAX_IMAGE_SIZE) {
                throw new IllegalArgumentException("Image file size exceeds maximum limit of 10 MB");
            }
        } else if (mediaType == MediaType.VIDEO) {
            if (!ALLOWED_VIDEO_EXTENSIONS.contains(extension)) {
                throw new IllegalArgumentException("Unsupported video format. Allowed formats: " + ALLOWED_VIDEO_EXTENSIONS);
            }
            if (file.getSize() > MAX_VIDEO_SIZE) {
                throw new IllegalArgumentException("Video file size exceeds maximum limit of 100 MB");
            }
        }
    }

    private MediaType determineMediaType(String extension) {
        if (ALLOWED_VIDEO_EXTENSIONS.contains(extension)) {
            return MediaType.VIDEO;
        }
        return MediaType.IMAGE;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private boolean isMockMode() {
        return cloudName == null || cloudName.trim().isEmpty() || apiKey == null || apiKey.trim().isEmpty();
    }
}
