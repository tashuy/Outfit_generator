package com.outfit.recommendation.module.marketplace.controller;

import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.module.marketplace.model.Wishlist;
import com.outfit.recommendation.module.auth.service.AuthService;
import com.outfit.recommendation.module.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(productService.getWishlist(user));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(productService.addToWishlist(user, productId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        productService.removeFromWishlist(user, productId);
        return ResponseEntity.ok().build();
    }
}
