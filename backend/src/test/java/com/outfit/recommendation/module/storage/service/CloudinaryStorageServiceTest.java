package com.outfit.recommendation.module.storage.service;

import com.cloudinary.Cloudinary;
import com.outfit.recommendation.module.storage.dto.MediaUploadResponse;
import com.outfit.recommendation.module.storage.model.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CloudinaryStorageServiceTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private LocalStorageService localStorageService;

    @InjectMocks
    private CloudinaryStorageService storageService;

    @BeforeEach
    public void setUp() {
        // Set mock mode for unit tests when no live credentials exist
        ReflectionTestUtils.setField(storageService, "cloudName", "");
        ReflectionTestUtils.setField(storageService, "apiKey", "");
        org.mockito.Mockito.lenient().when(localStorageService.store(org.mockito.ArgumentMatchers.any())).thenReturn("/uploads/test.jpg");
    }

    @Test
    public void shouldUploadImageInMockMode() {
        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "test-outfit.jpg",
                "image/jpeg",
                "dummy image content".getBytes()
        );

        MediaUploadResponse response = storageService.uploadMedia(imageFile);

        assertNotNull(response);
        assertEquals(MediaType.IMAGE, response.getMediaType());
        assertEquals("jpg", response.getFormat());
        assertNotNull(response.getMediaUrl());
        assertFalse(response.getMediaUrl().isEmpty());
        assertNotNull(response.getPublicId());
    }

    @Test
    public void shouldUploadVideoInMockMode() {
        MockMultipartFile videoFile = new MockMultipartFile(
                "file",
                "test-video.mp4",
                "video/mp4",
                "dummy video content".getBytes()
        );

        MediaUploadResponse response = storageService.uploadMedia(videoFile);

        assertNotNull(response);
        assertEquals(MediaType.VIDEO, response.getMediaType());
        assertEquals("mp4", response.getFormat());
        assertNotNull(response.getMediaUrl());
        assertFalse(response.getMediaUrl().isEmpty());
    }

    @Test
    public void shouldFailOnUnsupportedExtension() {
        MockMultipartFile badFile = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                "pdf content".getBytes()
        );

        assertThrows(IllegalArgumentException.class, () -> {
            storageService.uploadMedia(badFile);
        });
    }

    @Test
    public void shouldDeleteAssetInMockMode() {
        assertDoesNotThrow(() -> {
            storageService.deleteAsset("mock_public_id_123");
        });
    }
}
