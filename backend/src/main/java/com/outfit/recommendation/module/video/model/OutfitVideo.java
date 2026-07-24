package com.outfit.recommendation.module.video.model;

import com.outfit.recommendation.shared.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "outfit_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "video_url", nullable = false, length = 1000)
    private String mediaUrl;

    @Column(name = "public_id")
    private String publicId;

    @Column(name = "media_type", nullable = false)
    private String mediaType; // IMAGE or VIDEO

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "outfit_categories", joinColumns = @JoinColumn(name = "outfit_id"))
    @Column(name = "category")
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    @Column(name = "is_location_specific", nullable = false)
    @Builder.Default
    private Boolean isLocationSpecific = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "outfit_locations", joinColumns = @JoinColumn(name = "outfit_id"))
    @Column(name = "location")
    @Builder.Default
    private List<String> locations = new ArrayList<>();

    private String occasion;

    private String style;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "outfit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OutfitProduct> products = new ArrayList<>();

    public void setProducts(List<OutfitProduct> newProducts) {
        if (this.products == null) {
            this.products = new ArrayList<>();
        } else {
            this.products.clear();
        }
        if (newProducts != null) {
            this.products.addAll(newProducts);
        }
    }

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.mediaType == null) {
            this.mediaType = "VIDEO";
        }
        if (this.isLocationSpecific == null) {
            this.isLocationSpecific = true;
        }
    }

    // Backward compatibility helper
    public String getVideoUrl() {
        return mediaUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.mediaUrl = videoUrl;
    }

    public String getCategory() {
        return (categories != null && !categories.isEmpty()) ? categories.get(0) : null;
    }

    public void setCategory(String category) {
        if (this.categories == null) {
            this.categories = new ArrayList<>();
        }
        this.categories.clear();
        if (category != null && !category.trim().isEmpty()) {
            this.categories.add(category.trim());
        }
    }

    public String getLocation() {
        return (locations != null && !locations.isEmpty()) ? locations.get(0) : "";
    }

    public void setLocation(String location) {
        if (this.locations == null) {
            this.locations = new ArrayList<>();
        }
        this.locations.clear();
        if (location != null && !location.trim().isEmpty()) {
            this.locations.add(location.trim());
        }
    }
}
