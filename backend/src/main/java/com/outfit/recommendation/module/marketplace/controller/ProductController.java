package com.outfit.recommendation.module.marketplace.controller;

import com.outfit.recommendation.module.marketplace.model.Product;
import com.outfit.recommendation.module.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam("q") String query,
            @RequestParam(value = "budget", required = false) String budget) {
        
        List<Product> products = productService.searchAndRankProducts(query, budget);
        return ResponseEntity.ok(products);
    }
}
