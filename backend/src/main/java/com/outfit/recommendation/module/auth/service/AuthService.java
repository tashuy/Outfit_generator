package com.outfit.recommendation.module.auth.service;

import com.outfit.recommendation.config.JwtTokenProvider;
import com.outfit.recommendation.module.auth.dto.*;
import com.outfit.recommendation.shared.model.Role;
import com.outfit.recommendation.shared.model.SearchHistory;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.shared.model.UserPreference;
import com.outfit.recommendation.shared.repository.SearchHistoryRepository;
import com.outfit.recommendation.shared.repository.UserPreferenceRepository;
import com.outfit.recommendation.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .build();
        
        user = userRepository.save(user);

        // Initialize empty preferences
        UserPreference preference = UserPreference.builder()
                .user(user)
                .preferredGender("Unisex")
                .preferredStyle("Casual")
                .budgetBracket("₹1000-₹2000")
                .build();
        preferenceRepository.save(preference);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthenticationResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + request.getEmail()));

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthenticationResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    @Transactional
    public UserPreferenceResponse updatePreferences(User user, UserPreferenceRequest request) {
        UserPreference preference = preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> UserPreference.builder().user(user).build());
        
        preference.setPreferredGender(request.getPreferredGender());
        preference.setPreferredStyle(request.getPreferredStyle());
        preference.setBudgetBracket(request.getBudgetBracket());
        
        UserPreference saved = preferenceRepository.save(preference);
        return toPreferenceResponse(saved);
    }

    public Optional<UserPreference> getPreferences(User user) {
        return preferenceRepository.findByUserId(user.getId());
    }

    @Transactional
    public void saveSearchQuery(User user, String query) {
        SearchHistory history = SearchHistory.builder()
                .user(user)
                .searchQuery(query)
                .build();
        searchHistoryRepository.save(history);
    }

    public List<SearchHistory> getSearchHistory(User user) {
        return searchHistoryRepository.findByUserIdOrderBySearchedAtDesc(user.getId());
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .enabled(user.isEnabled())
                .build();
    }

    public UserPreferenceResponse toPreferenceResponse(UserPreference preference) {
        return UserPreferenceResponse.builder()
                .id(preference.getId())
                .preferredGender(preference.getPreferredGender())
                .preferredStyle(preference.getPreferredStyle())
                .budgetBracket(preference.getBudgetBracket())
                .updatedAt(preference.getUpdatedAt())
                .build();
    }
}
