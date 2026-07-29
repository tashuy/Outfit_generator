package com.outfit.recommendation.module.video.service;

import com.outfit.recommendation.module.auth.service.AuthService;
import com.outfit.recommendation.module.storage.service.CloudinaryStorageService;
import com.outfit.recommendation.module.video.dto.OutfitProductDto;
import com.outfit.recommendation.module.video.dto.OutfitRequestDto;
import com.outfit.recommendation.module.video.dto.OutfitResponseDto;
import com.outfit.recommendation.module.video.model.OutfitProduct;
import com.outfit.recommendation.module.video.model.OutfitVideo;
import com.outfit.recommendation.module.video.repository.OutfitProductRepository;
import com.outfit.recommendation.module.video.repository.OutfitVideoRepository;
import com.outfit.recommendation.shared.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OutfitVideoService {

    @Autowired
    private OutfitVideoRepository outfitVideoRepository;

    @Autowired
    private OutfitProductRepository outfitProductRepository;

    @Autowired
    private CloudinaryStorageService cloudinaryStorageService;

    @Autowired
    private AuthService authService;

    public List<OutfitResponseDto> getAllOutfits() {
        return outfitVideoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toOutfitResponseDto)
                .collect(Collectors.toList());
    }

    public List<OutfitVideo> getAllVideos() {
        return outfitVideoRepository.findAllByOrderByCreatedAtDesc();
    }

    public OutfitResponseDto getOutfitById(UUID id) {
        OutfitVideo outfit = outfitVideoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Outfit not found with ID: " + id));
        return toOutfitResponseDto(outfit);
    }

    public List<OutfitResponseDto> getOutfitsByCategory(String category) {
        return outfitVideoRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category)
                .stream()
                .map(this::toOutfitResponseDto)
                .collect(Collectors.toList());
    }

    public List<OutfitResponseDto> getOutfitsByLocation(String location) {
        return outfitVideoRepository.findByLocationIgnoreCaseOrderByCreatedAtDesc(location)
                .stream()
                .map(this::toOutfitResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OutfitResponseDto createOutfit(OutfitRequestDto requestDto, String userEmail) {
        User user = null;
        if (userEmail != null && !userEmail.trim().isEmpty()) {
            try {
                user = authService.getUserByEmail(userEmail);
            } catch (Exception e) {
                log.warn("Could not attach user to outfit: {}", e.getMessage());
            }
        }

        String mediaType = requestDto.getMediaType();
        if (mediaType == null || mediaType.trim().isEmpty()) {
            mediaType = requestDto.getMediaUrl().endsWith(".mp4") || requestDto.getMediaUrl().endsWith(".webm") || requestDto.getMediaUrl().endsWith(".mov") ? "VIDEO" : "IMAGE";
        }

        Set<String> categories = new HashSet<>();
        if (requestDto.getCategories() != null && !requestDto.getCategories().isEmpty()) {
            categories.addAll(requestDto.getCategories());
        } else if (requestDto.getCategory() != null && !requestDto.getCategory().trim().isEmpty()) {
            categories.add(requestDto.getCategory().trim());
        }

        Set<String> locations = new HashSet<>();
        if (requestDto.getLocations() != null && !requestDto.getLocations().isEmpty()) {
            locations.addAll(requestDto.getLocations());
        } else if (requestDto.getLocation() != null && !requestDto.getLocation().trim().isEmpty()) {
            locations.add(requestDto.getLocation().trim());
        }

        OutfitVideo outfit = OutfitVideo.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .mediaUrl(requestDto.getMediaUrl())
                .publicId(requestDto.getPublicId())
                .mediaType(mediaType.toUpperCase())
                .categories(categories)
                .isLocationSpecific(requestDto.getIsLocationSpecific() != null ? requestDto.getIsLocationSpecific() : true)
                .locations(locations)
                .occasion(requestDto.getOccasion())
                .style(requestDto.getStyle())
                .user(user)
                .build();

        if (requestDto.getProducts() != null && !requestDto.getProducts().isEmpty()) {
            for (OutfitProductDto productDto : requestDto.getProducts()) {
                OutfitProduct product = OutfitProduct.builder()
                        .outfit(outfit)
                        .productName(productDto.getProductName())
                        .productUrl(productDto.getProductUrl())
                        .platform(productDto.getPlatform())
                        .build();
                outfit.getProducts().add(product);
            }
        }

        OutfitVideo savedOutfit = outfitVideoRepository.save(outfit);

        log.info("Created outfit successfully: id={}, title={}", savedOutfit.getId(), savedOutfit.getTitle());
        return toOutfitResponseDto(savedOutfit);
    }

    @Transactional
    public OutfitResponseDto updateOutfit(UUID id, OutfitRequestDto requestDto) {
        OutfitVideo outfit = outfitVideoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Outfit not found with ID: " + id));

        outfit.setTitle(requestDto.getTitle());
        outfit.setDescription(requestDto.getDescription());
        outfit.setMediaUrl(requestDto.getMediaUrl());
        if (requestDto.getPublicId() != null) {
            outfit.setPublicId(requestDto.getPublicId());
        }
        if (requestDto.getMediaType() != null) {
            outfit.setMediaType(requestDto.getMediaType().toUpperCase());
        }
        
        Set<String> categories = new HashSet<>();
        if (requestDto.getCategories() != null && !requestDto.getCategories().isEmpty()) {
            categories.addAll(requestDto.getCategories());
        } else if (requestDto.getCategory() != null && !requestDto.getCategory().trim().isEmpty()) {
            categories.add(requestDto.getCategory().trim());
        }
        outfit.setCategories(categories);

        Set<String> locations = new HashSet<>();
        if (requestDto.getLocations() != null && !requestDto.getLocations().isEmpty()) {
            locations.addAll(requestDto.getLocations());
        } else if (requestDto.getLocation() != null && !requestDto.getLocation().trim().isEmpty()) {
            locations.add(requestDto.getLocation().trim());
        }
        outfit.setLocations(locations);

        outfit.setIsLocationSpecific(requestDto.getIsLocationSpecific() != null ? requestDto.getIsLocationSpecific() : true);
        outfit.setOccasion(requestDto.getOccasion());
        outfit.setStyle(requestDto.getStyle());

        // Update product links (replace existing safely via orphanRemoval)
        outfit.getProducts().clear();

        if (requestDto.getProducts() != null && !requestDto.getProducts().isEmpty()) {
            for (OutfitProductDto productDto : requestDto.getProducts()) {
                OutfitProduct product = OutfitProduct.builder()
                        .outfit(outfit)
                        .productName(productDto.getProductName())
                        .productUrl(productDto.getProductUrl())
                        .platform(productDto.getPlatform())
                        .build();
                outfit.getProducts().add(product);
            }
        }

        OutfitVideo updated = outfitVideoRepository.save(outfit);
        log.info("Updated outfit successfully: id={}, title={}", updated.getId(), updated.getTitle());
        return toOutfitResponseDto(updated);
    }

    @Transactional
    public void deleteOutfit(UUID id) {
        OutfitVideo outfit = outfitVideoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Outfit not found with ID: " + id));

        // Destroy remote Cloudinary asset if publicId exists
        if (outfit.getPublicId() != null && !outfit.getPublicId().trim().isEmpty()) {
            log.info("Deleting Cloudinary asset for outfit id={}, publicId={}", id, outfit.getPublicId());
            cloudinaryStorageService.deleteAsset(outfit.getPublicId());
        }

        outfitVideoRepository.delete(outfit);
        log.info("Deleted outfit from database: id={}", id);
    }

    // Legacy method support
    public OutfitVideo saveVideo(MultipartFile file, String title, String description, String location, String occasion, String style, String userEmail) {
        var mediaResponse = cloudinaryStorageService.uploadMedia(file);
        OutfitRequestDto dto = OutfitRequestDto.builder()
                .title(title)
                .description(description)
                .mediaUrl(mediaResponse.getMediaUrl())
                .publicId(mediaResponse.getPublicId())
                .mediaType(mediaResponse.getMediaType().name())
                .location(location)
                .occasion(occasion)
                .style(style)
                .build();

        OutfitResponseDto responseDto = createOutfit(dto, userEmail);
        return outfitVideoRepository.findById(responseDto.getId()).orElse(null);
    }

    public OutfitResponseDto toOutfitResponseDto(OutfitVideo outfit) {
        if (outfit == null) return null;

        List<OutfitProductDto> productDtos = new ArrayList<>();
        if (outfit.getProducts() != null) {
            productDtos = outfit.getProducts().stream()
                    .map(p -> OutfitProductDto.builder()
                            .id(p.getId())
                            .productName(p.getProductName())
                            .productUrl(p.getProductUrl())
                            .platform(p.getPlatform())
                            .clickCount(p.getClickCount() != null ? p.getClickCount() : 0L)
                            .build())
                    .collect(Collectors.toList());
        }

        return OutfitResponseDto.builder()
                .id(outfit.getId())
                .title(outfit.getTitle())
                .description(outfit.getDescription())
                .mediaUrl(outfit.getMediaUrl())
                .publicId(outfit.getPublicId())
                .mediaType(outfit.getMediaType())
                .category(outfit.getCategory())
                .categories(outfit.getCategories() != null ? new ArrayList<>(outfit.getCategories()) : new ArrayList<>())
                .isLocationSpecific(outfit.getIsLocationSpecific())
                .location(outfit.getLocation())
                .locations(outfit.getLocations() != null ? new ArrayList<>(outfit.getLocations()) : new ArrayList<>())
                .occasion(outfit.getOccasion())
                .style(outfit.getStyle())
                .viewCount(outfit.getViewCount() != null ? outfit.getViewCount() : 0L)
                .createdAt(outfit.getCreatedAt())
                .products(productDtos)
                .build();
    }
}
