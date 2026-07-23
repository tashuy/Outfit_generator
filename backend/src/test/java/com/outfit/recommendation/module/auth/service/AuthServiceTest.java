package com.outfit.recommendation.module.auth.service;

import com.outfit.recommendation.config.JwtTokenProvider;
import com.outfit.recommendation.module.auth.dto.AuthenticationResponse;
import com.outfit.recommendation.module.auth.dto.LoginRequest;
import com.outfit.recommendation.module.auth.dto.RegisterRequest;
import com.outfit.recommendation.shared.model.Role;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.shared.model.UserPreference;
import com.outfit.recommendation.shared.repository.SearchHistoryRepository;
import com.outfit.recommendation.shared.repository.UserPreferenceRepository;
import com.outfit.recommendation.shared.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;

public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserPreferenceRepository preferenceRepository;

    @Mock
    private SearchHistoryRepository searchHistoryRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void shouldRegisterNewUserSuccessfully() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setName("New User");

        Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        Mockito.when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail())
                .password("encoded-password")
                .name(request.getName())
                .role(Role.USER)
                .build();

        Mockito.when(userRepository.save(any(User.class))).thenReturn(savedUser);
        Mockito.when(jwtTokenProvider.generateToken(savedUser.getEmail())).thenReturn("token-123");

        AuthenticationResponse response = authService.register(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("token-123", response.getToken());
        Assertions.assertEquals("new@example.com", response.getEmail());
        Assertions.assertEquals("New User", response.getName());
        Mockito.verify(userRepository, Mockito.times(1)).save(any(User.class));
        Mockito.verify(preferenceRepository, Mockito.times(1)).save(any(UserPreference.class));
    }

    @Test
    public void shouldThrowExceptionWhenRegisteringExistingEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setName("Existing User");

        Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            authService.register(request);
        });

        Mockito.verify(userRepository, Mockito.never()).save(any(User.class));
    }

    @Test
    public void shouldLoginUserSuccessfully() {
        LoginRequest request = new LoginRequest("user@example.com", "password");

        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        User user = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .name("User Name")
                .role(Role.USER)
                .build();

        Mockito.when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        Mockito.when(jwtTokenProvider.generateToken(user.getEmail())).thenReturn("jwt-token-xyz");

        AuthenticationResponse response = authService.login(request);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("jwt-token-xyz", response.getToken());
        Assertions.assertEquals("user@example.com", response.getEmail());
        Assertions.assertEquals("User Name", response.getName());
    }
}
