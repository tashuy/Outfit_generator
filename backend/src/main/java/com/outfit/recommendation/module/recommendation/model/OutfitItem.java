package com.outfit.recommendation.module.recommendation.model;
import com.outfit.recommendation.module.marketplace.model.Product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "outfit_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutfitItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "look_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private OutfitLook look;

    @Column(nullable = false)
    private String category; // e.g., Shirt, Shoes, Trouser, Jacket

    @Column(nullable = false)
    private String description; // e.g., White Linen Shirt

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "matched_product_id")
    private Product matchedProduct;
}
