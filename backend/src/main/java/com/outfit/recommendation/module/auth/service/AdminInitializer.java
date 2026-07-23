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

        if (!userRepository.existsByEmail(adminEmail)) {
            log.info("Admin user not found. Seeding default Admin user...");
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .name("Platform Admin")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            log.info("Default Admin user created successfully: email={}", adminEmail);
        } else {
            log.info("Admin user already exists in database: email={}", adminEmail);
        }
    }
}
