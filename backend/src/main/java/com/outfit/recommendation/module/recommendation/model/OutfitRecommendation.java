package com.outfit.recommendation.module.recommendation.model;
import com.outfit.recommendation.shared.model.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "outfit_recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String occasion;

    @Column(nullable = false)
    private String budget;

    @Column(nullable = false)
    private String style;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String location;

    @Column(name = "weather_info")
    private String weatherInfo;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "suitability_score")
    private Double suitabilityScore;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "weather_score")
    private Double weatherScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OutfitLook> looks = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
