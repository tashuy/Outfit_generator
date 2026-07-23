package com.outfit.recommendation.module.marketplace.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private String brand;

    @Column(nullable = false)
    private Double price;

    private String color;

    private String material;

    @Column(name = "product_url", length = 1024)
    private String productUrl;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    private String marketplace; // e.g., Myntra, Ajio, Savana, Meesho

    private Double rating;
}
