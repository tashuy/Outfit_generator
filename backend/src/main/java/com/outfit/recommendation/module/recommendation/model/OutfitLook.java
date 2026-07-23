package com.outfit.recommendation.module.recommendation.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "outfit_looks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitLook {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private OutfitRecommendation recommendation;

    @Column(name = "look_name", nullable = false)
    private String lookName;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "look_score")
    private Double lookScore;

    @Column(name = "fashion_score")
    private Double fashionScore;

    @Column(name = "color_score")
    private Double colorScore;

    @Column(name = "fabric_score")
    private Double fabricScore;

    @Column(name = "budget_score")
    private Double budgetScore;

    @Column(name = "occasion_score")
    private Double occasionScore;

    @Column(name = "styling_notes", columnDefinition = "TEXT")
    private String stylingNotes;

    @OneToMany(mappedBy = "look", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OutfitItem> items = new ArrayList<>();
}
