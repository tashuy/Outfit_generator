package com.outfit.recommendation.module.recommendation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.outfit.recommendation.module.recommendation.dto.OutfitGenerationRequest;
import com.outfit.recommendation.module.weather.dto.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Cacheable(value = "geminiRecommendations", key = "T(java.util.Objects).hash(#request.occasion, #request.budget, #request.style, #request.gender, #request.location, #request.age, #request.bodyType, #weather.temperature)")
    public String generateOutfitSuggestion(OutfitGenerationRequest request, WeatherResponse weather) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is not set. Using local styling engine fallback.");
            return generateLocalFallbackSuggestion(request.getOccasion(), request.getBudget(), request.getStyle(), request.getGender(), request.getLocation(), weather);
        }

        try {
            String prompt = buildPrompt(request, weather);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct payload: { "contents": [{ "parts": [{ "text": prompt }] }], "generationConfig": { "responseMimeType": "application/json" } }
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> partContainer = new HashMap<>();
            partContainer.put("parts", new Object[]{textPart});

            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("responseMimeType", "application/json");

            Map<String, Object> payload = new HashMap<>();
            payload.put("contents", new Object[]{partContainer});
            payload.put("generationConfig", genConfig);

            String requestUrl = apiUrl + "?key=" + apiKey;
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            log.info("Sending request to Gemini API: {}", apiUrl);
            String responseStr = restTemplate.postForObject(requestUrl, entity, String.class);
            
            // Extract the generated text from Gemini response structure: candidates[0].content.parts[0].text
            JsonNode root = objectMapper.readTree(responseStr);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String generatedJson = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                log.info("Gemini API returned valid JSON structure.");
                return generatedJson;
            }
        } catch (Exception e) {
            log.error("Failed to generate outfit suggestion via Gemini API: {}. Falling back.", e.getMessage());
        }

        return generateLocalFallbackSuggestion(request.getOccasion(), request.getBudget(), request.getStyle(), request.getGender(), request.getLocation(), weather);
    }

    private String buildPrompt(OutfitGenerationRequest request, WeatherResponse weather) {
        return "You are an expert AI Stylist, Celebrity Stylist, and Recommendation System Architect. Recommend exactly 3 complete looks (head-to-toe) for a person with the following inputs:\n" +
                "Gender: " + request.getGender() + "\n" +
                "Age: " + (request.getAge() != null ? request.getAge() : "N/A") + "\n" +
                "Occasion: " + request.getOccasion() + "\n" +
                "Budget Category: " + request.getBudget() + "\n" +
                "Preferred Style: " + request.getStyle() + "\n" +
                "Body Type: " + (request.getBodyType() != null ? request.getBodyType() : "N/A") + "\n" +
                "Location: " + request.getLocation() + "\n" +
                "Favorite Colors: " + (request.getFavoriteColors() != null ? String.join(", ", request.getFavoriteColors()) : "Any") + "\n" +
                "Colors to Avoid: " + (request.getAvoidColors() != null ? String.join(", ", request.getAvoidColors()) : "None") + "\n" +
                "Current Weather: " + weather.getTemperature() + "°C, " + weather.getSeason() + ". Note: " + weather.getAdvice() + "\n\n" +
                "Provide the response ONLY in JSON format following this exact structure, with no markdown tags or code blocks outside the JSON:\n" +
                "{\n" +
                "  \"explanation\": \"Overall explanation of why these styles suit the weather, occasion, and style preference.\",\n" +
                "  \"suitabilityScore\": 9.5,\n" +
                "  \"overallScore\": 95.0,\n" +
                "  \"weatherScore\": 20.0,\n" +
                "  \"looks\": [\n" +
                "    {\n" +
                "      \"lookName\": \"Look 1: [Descriptive Title]\",\n" +
                "      \"stylingNotes\": \"Detailed advice on how to wear this look.\",\n" +
                "      \"lookScore\": 95.0,\n" +
                "      \"fashionScore\": 19.0,\n" +
                "      \"colorScore\": 10.0,\n" +
                "      \"fabricScore\": 10.0,\n" +
                "      \"budgetScore\": 10.0,\n" +
                "      \"occasionScore\": 10.0,\n" +
                "      \"items\": [\n" +
                "        { \"category\": \"Top\", \"description\": \"Short description of top (e.g., White Linen Shirt)\" },\n" +
                "        { \"category\": \"Bottom\", \"description\": \"Short description of bottom (e.g., Beige Linen Trouser)\" },\n" +
                "        { \"category\": \"Shoes\", \"description\": \"Short description of footwear (e.g., White Minimalist Sneakers)\" },\n" +
                "        { \"category\": \"Accessory\", \"description\": \"Short description of accessory (e.g., Silver Watch)\" }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n" +
                "Generate exactly 3 looks. Scoring parameters (out of 100 total lookScore): weatherScore (max 20), fashionScore (max 20), colorScore (max 10), fabricScore (max 10), budgetScore (max 10), occasionScore (max 10). Keep descriptions clear and realistic so we can find matching products in our store catalog. Make sure the clothing matches the budget tier (e.g. Under ₹999 will have simple cotton/polyester, ₹5000+ can have luxury fabrics or premium brands).";
    }

    private String generateLocalFallbackSuggestion(String occasion, String budget, String style, String gender, String location, WeatherResponse weather) {
        boolean isFemale = "female".equalsIgnoreCase(gender);
        boolean isWarm = weather.getTemperature() > 25.0;
        
        // Define some realistic styled items based on inputs
        String look1Title, look1Notes, look1Top, look1Bottom, look1Shoes, look1Acc;
        String look2Title, look2Notes, look2Top, look2Bottom, look2Shoes, look2Acc;
        String look3Title, look3Notes, look3Top, look3Bottom, look3Shoes, look3Acc;

        if (isFemale) {
            if ("Wedding".equalsIgnoreCase(occasion)) {
                look1Title = "Look 1: Traditional Elegance";
                look1Notes = "Stunning traditional style suitable for main wedding events.";
                look1Top = "Pink Embroidered Kurta Set";
                look1Bottom = "Matching Palazzo Pants";
                look1Shoes = "Embellished Mojaris";
                look1Acc = "Golden Jhumka Earrings";

                look2Title = "Look 2: Fusion Chic";
                look2Notes = "A modern blend of Western and Indian styles for pre-wedding functions.";
                look2Top = "Floral Print Silk Crop Top";
                look2Bottom = "Georgette Lehenga Skirt";
                look2Shoes = "Block Heels";
                look2Acc = "Silver Choker";

                look3Title = "Look 3: Premium Grace";
                look3Notes = "A premium look designed to make a statement.";
                look3Top = "Navy Blue Anarkali Suit";
                look3Bottom = "Leggings with Dupatta";
                look3Shoes = "Metallic Stilettos";
                look3Acc = "Clutch Bag";
            } else if ("Vacation".equalsIgnoreCase(occasion) || "Casual Outing".equalsIgnoreCase(occasion)) {
                look1Title = "Look 1: Beachside Breeze";
                look1Notes = "Flowy and breathable materials for walks and relaxed days.";
                look1Top = "White Cotton Camisole";
                look1Bottom = "Yellow Floral Tiered Midi Skirt";
                look1Shoes = "Tan Leather Sandals";
                look1Acc = "Straw Sun Hat";

                look2Title = "Look 2: Street Smart";
                look2Notes = "Comfortable, modern, and practical style for sightseeing.";
                look2Top = "Cropped Ribbed Knit Tee";
                look2Bottom = "High-Waist Wide-Leg Denim";
                look2Shoes = "Platform White Sneakers";
                look2Acc = "Canvas Tote Bag";

                look3Title = "Look 3: Retro Chic";
                look3Notes = "Stylishly relaxed vintage style for cafes.";
                look3Top = "Oversized Linen Button Up Shirt";
                look3Bottom = "Sage Green Linen Shorts";
                look3Shoes = "Espadrilles";
                look3Acc = "Retro Sunglasses";
            } else {
                // Default Female - Casual / Date / Office
                look1Title = "Look 1: Minimalist Chic";
                look1Notes = "Elegant and effortless look combining basic tones.";
                look1Top = "Beige Fitted Knit Top";
                look1Bottom = "Black Ankle-Length Trousers";
                look1Shoes = "Pointed Flats";
                look1Acc = "Minimalist Gold Chain";

                look2Title = "Look 2: Korean Aesthetic";
                look2Notes = "Very trendy pastel styling inspired by Seoul street fashion.";
                look2Top = "Oversized Pastel Blue Cardigan with White Tank";
                look2Bottom = "White Pleated A-line Skirt";
                look2Shoes = "Canvas Chunky Sneakers";
                look2Acc = "Pastel Shoulder Bag";

                look3Title = "Look 3: Date Night Edge";
                look3Notes = "A balance of sweet and edgy for an evening out.";
                look3Top = "Black Satin Camisole";
                look3Bottom = "Dark Wash Straight Leg Jeans";
                look3Shoes = "Strappy Heeled Sandals";
                look3Acc = "Leather Crossbody Bag";
            }
        } else {
            // Male options
            if ("Wedding".equalsIgnoreCase(occasion)) {
                look1Title = "Look 1: Royal Sherwani";
                look1Notes = "Classic traditional look for prime wedding ceremonies.";
                look1Top = "Cream Embroidered Sherwani";
                look1Bottom = "Maroon Churidar Pyjama";
                look1Shoes = "Velvet Juttis";
                look1Acc = "Pocket Square";

                look2Title = "Look 2: Indo-Western Fusion";
                look2Notes = "A crisp modern silhouette for sangeet or cocktail functions.";
                look2Top = "Navy Blue Bandhgala Kurta";
                look2Bottom = "White Slim-Fit Trousers";
                look2Shoes = "Brown Leather Loafers";
                look2Acc = "Classic Watch";

                look3Title = "Look 3: Classic Kurta Style";
                look3Notes = "Comfortable yet festive styling for family gatherings.";
                look3Top = "Mustard Yellow Silk Blend Kurta";
                look3Bottom = "White Pajama";
                look3Shoes = "Kolhapuri Sandals";
                look3Acc = "Beaded Bracelet";
            } else if ("Vacation".equalsIgnoreCase(occasion) || "Casual Outing".equalsIgnoreCase(occasion)) {
                look1Title = "Look 1: Island Explorer";
                look1Notes = "Relaxed summer vibe, airy fabrics to handle heat.";
                look1Top = "Cuban Collar Floral Rayon Shirt";
                look1Bottom = "Beige Linen Shorts";
                look1Shoes = "Espadrilles";
                look1Acc = "Tortoiseshell Sunglasses";

                look2Title = "Look 2: Urban Wanderer";
                look2Notes = "Practical and cool for city exploring.";
                look2Top = "Olive Green Heavyweight T-Shirt";
                look2Bottom = "Black Cargo Joggers";
                look2Shoes = "Black Running Sneakers";
                look2Acc = "Sling Bag";

                look3Title = "Look 3: Smart Casual Cruise";
                look3Notes = "Polished look that transitions easily from beach to dinner.";
                look3Top = "White Linen Shirt";
                look3Bottom = "Light Blue Cotton Chinos";
                look3Shoes = "Tan Suede Loafers";
                look3Acc = "Leather Strap Watch";
            } else {
                // Default Male - Casual / Date / Office
                look1Title = "Look 1: Old Money Minimal";
                look1Notes = "A tailored, wealthy aesthetic based on neutral palettes and clean fits.";
                look1Top = "Navy Blue Knit Polo Shirt";
                look1Bottom = "Beige Tailored Chinos";
                look1Shoes = "White Leather Sneakers";
                look1Acc = "Brown Leather Belt";

                look2Title = "Look 2: Korean Oversized";
                look2Notes = "Modern streetwear look with loose silhouettes and high comfort.";
                look2Top = "Oversized Grey Graphic Sweatshirt with White Tee underneath";
                look2Bottom = "Off-White Wide Fit Pants";
                look2Shoes = "Chunky Retro Trainers";
                look2Acc = "Silver Chain Necklace";

                look3Title = "Look 3: Date Night Smart";
                look3Notes = "Sleek and attractive dark tones, perfect for dinner dates.";
                look3Top = "Black Slim Fit Cotton Shirt";
                look3Bottom = "Dark Grey Checked Trousers";
                look3Shoes = "Black Leather Chelsea Boots";
                look3Acc = "Silver Watch";
            }
        }

        String budgetFactor = "Under ₹999".equals(budget) ? "budget-friendly cotton materials" : "premium materials";
        String weatherAdviceText = weather.getAdvice();

        return "{\n" +
                "  \"explanation\": \"Based on the " + weather.getSeason() + " weather in " + location + " (" + weather.getTemperature() + "°C), we recommend outfits built with " + budgetFactor + ". " + weatherAdviceText + " these combinations emphasize the requested " + style + " style for a " + occasion + " occasion.\",\n" +
                "  \"suitabilityScore\": 9.6,\n" +
                "  \"looks\": [\n" +
                "    {\n" +
                "      \"lookName\": \"" + look1Title + "\",\n" +
                "      \"stylingNotes\": \"" + look1Notes + "\",\n" +
                "      \"items\": [\n" +
                "        { \"category\": \"Top\", \"description\": \"" + look1Top + "\" },\n" +
                "        { \"category\": \"Bottom\", \"description\": \"" + look1Bottom + "\" },\n" +
                "        { \"category\": \"Shoes\", \"description\": \"" + look1Shoes + "\" },\n" +
                "        { \"category\": \"Accessory\", \"description\": \"" + look1Acc + "\" }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"lookName\": \"" + look2Title + "\",\n" +
                "      \"stylingNotes\": \"" + look2Notes + "\",\n" +
                "      \"items\": [\n" +
                "        { \"category\": \"Top\", \"description\": \"" + look2Top + "\" },\n" +
                "        { \"category\": \"Bottom\", \"description\": \"" + look2Bottom + "\" },\n" +
                "        { \"category\": \"Shoes\", \"description\": \"" + look2Shoes + "\" },\n" +
                "        { \"category\": \"Accessory\", \"description\": \"" + look2Acc + "\" }\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"lookName\": \"" + look3Title + "\",\n" +
                "      \"stylingNotes\": \"" + look3Notes + "\",\n" +
                "      \"items\": [\n" +
                "        { \"category\": \"Top\", \"description\": \"" + look3Top + "\" },\n" +
                "        { \"category\": \"Bottom\", \"description\": \"" + look3Bottom + "\" },\n" +
                "        { \"category\": \"Shoes\", \"description\": \"" + look3Shoes + "\" },\n" +
                "        { \"category\": \"Accessory\", \"description\": \"" + look3Acc + "\" }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";
    }
}
