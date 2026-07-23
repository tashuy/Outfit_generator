package com.outfit.recommendation.module.video.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.outfit.recommendation.config.JwtTokenProvider;
import com.outfit.recommendation.module.auth.service.CustomUserDetailsService;
import com.outfit.recommendation.module.video.dto.OutfitProductDto;
import com.outfit.recommendation.module.video.dto.OutfitRequestDto;
import com.outfit.recommendation.module.video.dto.OutfitResponseDto;
import com.outfit.recommendation.module.video.service.OutfitVideoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminOutfitController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminOutfitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OutfitVideoService outfitVideoService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private OutfitRequestDto requestDto;
    private OutfitResponseDto responseDto;
    private UUID outfitId;

    @BeforeEach
    public void setUp() {
        outfitId = UUID.randomUUID();

        OutfitProductDto productDto = OutfitProductDto.builder()
                .id(UUID.randomUUID())
                .productName("White Cotton Shirt")
                .productUrl("https://myntra.com/product/123")
                .platform("Myntra")
                .build();

        requestDto = OutfitRequestDto.builder()
                .title("Goa Summer Vibe")
                .description("Lightweight linen outfit for Goa beach")
                .mediaUrl("https://res.cloudinary.com/demo/image/upload/goa.jpg")
                .publicId("goa_123")
                .mediaType("IMAGE")
                .category("CASUAL")
                .isLocationSpecific(true)
                .location("Goa")
                .products(Collections.singletonList(productDto))
                .build();

        responseDto = OutfitResponseDto.builder()
                .id(outfitId)
                .title("Goa Summer Vibe")
                .description("Lightweight linen outfit for Goa beach")
                .mediaUrl("https://res.cloudinary.com/demo/image/upload/goa.jpg")
                .publicId("goa_123")
                .mediaType("IMAGE")
                .category("CASUAL")
                .isLocationSpecific(true)
                .location("Goa")
                .products(Collections.singletonList(productDto))
                .build();
    }

    @Test
    public void shouldCreateOutfitSuccessfully() throws Exception {
        Mockito.when(outfitVideoService.createOutfit(any(OutfitRequestDto.class), any())).thenReturn(responseDto);

        mockMvc.perform(post("/api/admin/outfits")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(outfitId.toString()))
                .andExpect(jsonPath("$.title").value("Goa Summer Vibe"))
                .andExpect(jsonPath("$.products[0].productName").value("White Cotton Shirt"));
    }

    @Test
    public void shouldUpdateOutfitSuccessfully() throws Exception {
        Mockito.when(outfitVideoService.updateOutfit(eq(outfitId), any(OutfitRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/api/admin/outfits/" + outfitId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Goa Summer Vibe"));
    }

    @Test
    public void shouldDeleteOutfitSuccessfully() throws Exception {
        Mockito.doNothing().when(outfitVideoService).deleteOutfit(outfitId);

        mockMvc.perform(delete("/api/admin/outfits/" + outfitId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Outfit deleted successfully"));
    }
}
