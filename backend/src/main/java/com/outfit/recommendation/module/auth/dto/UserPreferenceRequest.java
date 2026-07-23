package com.outfit.recommendation.module.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceRequest {
    @NotBlank(message = "Preferred gender is required")
    private String preferredGender;

    @NotBlank(message = "Preferred style is required")
    private String preferredStyle;

    @NotBlank(message = "Budget bracket is required")
    private String budgetBracket;
}
