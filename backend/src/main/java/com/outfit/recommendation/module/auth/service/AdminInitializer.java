package com.outfit.recommendation.module.auth.service;

import com.outfit.recommendation.shared.model.Role;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.shared.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@outfit.com";

        User admin = userRepository.findByEmail(adminEmail)
                .orElseGet(() -> User.builder()
                        .email(adminEmail)
                        .name("Platform Admin")
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build());

        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);

        userRepository.save(admin);
        log.info("Default Admin user ensured/seeded successfully: email={}", adminEmail);
    }
}
