package com.outfit.recommendation.module.marketplace.repository;

import com.outfit.recommendation.module.marketplace.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.color) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.material) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    List<Product> findByCategoryIgnoreCase(String category);
    
    @Query("SELECT p FROM Product p WHERE p.price <= :maxPrice")
    List<Product> findProductsBelowPrice(@Param("maxPrice") Double maxPrice);
}
