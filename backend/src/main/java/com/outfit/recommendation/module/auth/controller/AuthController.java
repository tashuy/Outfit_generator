package com.outfit.recommendation.module.auth.controller;

import com.outfit.recommendation.module.auth.dto.*;
import com.outfit.recommendation.shared.model.SearchHistory;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.shared.model.UserPreference;
import com.outfit.recommendation.module.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully logged out");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", authService.toUserResponse(user));
        
        UserPreference prefs = authService.getPreferences(user).orElse(null);
        response.put("preferences", prefs != null ? authService.toPreferenceResponse(prefs) : null);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/preferences")
    public ResponseEntity<UserPreferenceResponse> updatePreferences(@Valid @RequestBody UserPreferenceRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(authService.updatePreferences(user, request));
    }

    @GetMapping("/user/search-history")
    public ResponseEntity<List<SearchHistory>> getSearchHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(authService.getSearchHistory(user));
    }
}
