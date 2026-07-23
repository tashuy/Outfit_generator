package com.outfit.recommendation.module.storage.dto;

import com.outfit.recommendation.module.storage.model.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaUploadResponse {
    private String mediaUrl;
    private String publicId;
    private MediaType mediaType;
    private String format;
    private Long sizeBytes;
    private LocalDateTime createdAt;
}
