package com.outfit.recommendation.module.storage.controller;

import com.outfit.recommendation.config.JwtTokenProvider;
import com.outfit.recommendation.module.auth.service.CustomUserDetailsService;
import com.outfit.recommendation.module.storage.dto.MediaUploadResponse;
import com.outfit.recommendation.module.storage.model.MediaType;
import com.outfit.recommendation.module.storage.service.CloudinaryStorageService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MediaUploadController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MediaUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CloudinaryStorageService cloudinaryStorageService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    public void shouldUploadMediaSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png", "bytes".getBytes());
        MediaUploadResponse response = MediaUploadResponse.builder()
                .mediaUrl("https://res.cloudinary.com/demo/image/upload/sample.png")
                .publicId("sample_png")
                .mediaType(MediaType.IMAGE)
                .format("png")
                .sizeBytes(5L)
                .build();

        Mockito.when(cloudinaryStorageService.uploadMedia(any())).thenReturn(response);

        mockMvc.perform(multipart("/api/admin/media/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mediaUrl").value("https://res.cloudinary.com/demo/image/upload/sample.png"))
                .andExpect(jsonPath("$.publicId").value("sample_png"))
                .andExpect(jsonPath("$.mediaType").value("IMAGE"));
    }

    @Test
    public void shouldDeleteMediaSuccessfully() throws Exception {
        Mockito.doNothing().when(cloudinaryStorageService).deleteAsset("sample_png");

        mockMvc.perform(delete("/api/admin/media").param("publicId", "sample_png"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Media asset deleted successfully"))
                .andExpect(jsonPath("$.publicId").value("sample_png"));
    }
}
