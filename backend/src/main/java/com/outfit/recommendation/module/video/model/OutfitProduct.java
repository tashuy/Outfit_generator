package com.outfit.recommendation.module.video.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "outfit_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outfit_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private OutfitVideo outfit;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_url", nullable = false, length = 1000)
    private String productUrl;

    @Column(nullable = false)
    private String platform;

    @Column(name = "click_count", nullable = false)
    @Builder.Default
    private Long clickCount = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.clickCount == null) {
            this.clickCount = 0L;
        }
    }
}
