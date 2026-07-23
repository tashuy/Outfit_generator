package com.outfit.recommendation.module.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceResponse {
    private UUID id;
    private String preferredGender;
    private String preferredStyle;
    private String budgetBracket;
    private LocalDateTime updatedAt;
}
