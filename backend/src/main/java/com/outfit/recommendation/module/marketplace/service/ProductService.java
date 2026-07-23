package com.outfit.recommendation.module.marketplace.service;

import com.outfit.recommendation.module.marketplace.model.Product;
import com.outfit.recommendation.shared.model.User;
import com.outfit.recommendation.module.marketplace.model.Wishlist;
import com.outfit.recommendation.module.marketplace.repository.ProductRepository;
import com.outfit.recommendation.module.marketplace.repository.WishlistRepository;
import com.outfit.recommendation.module.recommendation.service.RuleEngine;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private RuleEngine ruleEngine;

    @PostConstruct
    public void initCatalog() {
        if (productRepository.count() == 0) {
            log.info("Product database is empty. Seeding catalog products...");
            seedProducts();
            log.info("Product database seeded successfully. Current size: {}", productRepository.count());
        }
    }

    private void seedProducts() {
        List<Product> products = new ArrayList<>();

        // Format: Name, Category, Brand, Price, Color, Material, URL, ImageURL, Marketplace, Rating

        // Male Old Money / Linen Summer looks
        products.add(createProduct("White Linen Shirt", "Top", "Zara", 1299.0, "White", "Linen", "https://www.meesho.com/zara-white-linen", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.5));
        products.add(createProduct("Beige Linen Trouser", "Bottom", "Marks & Spencer", 1699.0, "Beige", "Linen", "https://www.meesho.com/ms-beige-trouser", "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("White Leather Sneakers", "Shoes", "Puma", 1899.0, "White", "Leather", "https://www.meesho.com/puma-white-sneaker", "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", "Meesho", 4.6));
        products.add(createProduct("Silver Watch", "Accessory", "Titan", 2499.0, "Silver", "Metal", "https://www.meesho.com/titan-silver-watch", "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=80", "Meesho", 4.4));
        products.add(createProduct("Brown Leather Belt", "Accessory", "Levis", 499.0, "Brown", "Leather", "https://www.meesho.com/levis-belt", "https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));
        
        // Male Old Money / Knit Polo
        products.add(createProduct("Navy Blue Knit Polo Shirt", "Top", "Zara", 899.0, "Navy", "Knit Cotton", "https://www.meesho.com/zara-navy-polo", "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Beige Tailored Chinos", "Bottom", "H&M", 1199.0, "Beige", "Cotton Twill", "https://www.meesho.com/hm-beige-chinos", "https://images.unsplash.com/photo-1473966968600-fa804b86d526?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));

        // Female Traditional / Wedding looks
        products.add(createProduct("Pink Embroidered Kurta Set", "Top", "Libas", 2199.0, "Pink", "Silk Blend", "https://www.meesho.com/libas-pink-kurta", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.7));
        products.add(createProduct("Matching Palazzo Pants", "Bottom", "Aurelia", 799.0, "Pink", "Cotton", "https://www.meesho.com/aurelia-pink-palazzo", "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Embellished Mojaris", "Shoes", "Catwalk", 999.0, "Gold", "Fabric", "https://www.meesho.com/catwalk-mojaris", "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=400&q=80", "Meesho", 4.5));
        products.add(createProduct("Golden Jhumka Earrings", "Accessory", "YouBella", 349.0, "Gold", "Alloy", "https://www.meesho.com/golden-jhumka", "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));

        // Female Casual Outings / Vacation looks
        products.add(createProduct("White Cotton Camisole", "Top", "H&M", 399.0, "White", "Cotton", "https://www.meesho.com/hm-white-cami", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Yellow Floral Tiered Midi Skirt", "Bottom", "Savana", 899.0, "Yellow", "Rayon", "https://www.meesho.com/skirt-floral", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Tan Leather Sandals", "Shoes", "Bata", 799.0, "Tan", "Leather", "https://www.meesho.com/bata-tan-sandal", "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=400&q=80", "Meesho", 4.4));
        products.add(createProduct("Straw Sun Hat", "Accessory", "Dressberry", 299.0, "Beige", "Straw", "https://www.meesho.com/sunhat", "https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&w=400&q=80", "Meesho", 3.9));

        // Male Casual Outings / Travel looks
        products.add(createProduct("Cuban Collar Floral Rayon Shirt", "Top", "Jack & Jones", 999.0, "Multicolor", "Rayon", "https://www.meesho.com/jj-floral-shirt", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Beige Linen Shorts", "Bottom", "H&M", 799.0, "Beige", "Linen", "https://www.meesho.com/hm-linen-short", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Espadrilles", "Shoes", "Bata", 699.0, "Beige", "Canvas", "https://www.meesho.com/espadrilles", "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));
        products.add(createProduct("Tortoiseshell Sunglasses", "Accessory", "Vogue", 1499.0, "Brown", "Acetate", "https://www.meesho.com/tortoise-sunglasses", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));

        // Male Streetwear Korean looks
        products.add(createProduct("Oversized Grey Graphic Sweatshirt", "Top", "H&M", 1199.0, "Grey", "Fleece Cotton", "https://www.meesho.com/hm-grey-sweatshirt", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80", "Meesho", 4.5));
        products.add(createProduct("Off-White Wide Fit Pants", "Bottom", "Zara", 1499.0, "Off-White", "Cotton", "https://www.meesho.com/zara-off-white-pants", "https://images.unsplash.com/photo-1506629082925-41f2e99a3ce7?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("Chunky Retro Trainers", "Shoes", "Nike", 2999.0, "Grey/White", "Mesh/Rubber", "https://www.meesho.com/nike-retro-trainer", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80", "Meesho", 4.7));
        products.add(createProduct("Silver Chain Necklace", "Accessory", "Giva", 499.0, "Silver", "Sterling Silver", "https://www.meesho.com/giva-silver-chain", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));

        // Female Korean style looks
        products.add(createProduct("Oversized Pastel Blue Cardigan", "Top", "H&M", 1599.0, "Blue", "Acrylic Knit", "https://www.meesho.com/hm-cardigan", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", "Meesho", 4.5));
        products.add(createProduct("White Pleated A-line Skirt", "Bottom", "Zara", 999.0, "White", "Polyester", "https://www.meesho.com/zara-white-skirt", "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Canvas Chunky Sneakers", "Shoes", "Converse", 1299.0, "White", "Canvas", "https://www.meesho.com/converse-chunky", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80", "Meesho", 4.4));
        products.add(createProduct("Pastel Shoulder Bag", "Accessory", "Savana", 799.0, "Blue", "Faux Leather", "https://www.meesho.com/shoulder-bag", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));

        // Female Date Night looks
        products.add(createProduct("Black Satin Camisole", "Top", "Savana", 599.0, "Black", "Satin", "https://www.meesho.com/cami-satin", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Dark Wash Straight Leg Jeans", "Bottom", "Levis", 1499.0, "Dark Blue", "Denim", "https://www.meesho.com/levis-dark-jeans", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80", "Meesho", 4.4));
        products.add(createProduct("Strappy Heeled Sandals", "Shoes", "Catwalk", 1499.0, "Black", "Synthetic", "https://www.meesho.com/catwalk-heels", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80", "Meesho", 4.5));
        products.add(createProduct("Leather Crossbody Bag", "Accessory", "DailyObjects", 999.0, "Black", "Leather", "https://www.meesho.com/crossbody-bag", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));

        // Male Date Night looks
        products.add(createProduct("Black Slim Fit Cotton Shirt", "Top", "Arrow", 999.0, "Black", "Cotton", "https://www.meesho.com/arrow-black-shirt", "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Dark Grey Checked Trousers", "Bottom", "Van Heusen", 1299.0, "Grey", "Viscose", "https://www.meesho.com/vh-grey-trousers", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80", "Meesho", 4.4));
        products.add(createProduct("Black Leather Chelsea Boots", "Shoes", "Woodland", 3499.0, "Black", "Leather", "https://www.meesho.com/woodland-chelsea-boots", "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=400&q=80", "Meesho", 4.6));

        // Seed extremely cheap budget alternatives (Prices ₹149 - ₹399) to support combined budget outfits
        // Budget Male Top
        products.add(createProduct("Basic White Cotton T-shirt", "Top", "Max", 249.0, "White", "Cotton", "https://www.meesho.com/max-white-tee", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));
        products.add(createProduct("Plain Black T-shirt", "Top", "Max", 199.0, "Black", "Cotton", "https://www.meesho.com/max-black-tee", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Grey Cotton T-Shirt", "Top", "Roadster", 299.0, "Grey", "Cotton", "https://www.meesho.com/grey-tee", "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));

        // Budget Male Bottom
        products.add(createProduct("Grey Cotton Jogger Shorts", "Bottom", "Roadster", 299.0, "Grey", "Fleece", "https://www.meesho.com/grey-shorts", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Black Jogger Shorts", "Bottom", "Roadster", 349.0, "Black", "Cotton", "https://www.meesho.com/black-shorts", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("Blue Denim Shorts", "Bottom", "Roadster", 399.0, "Blue", "Denim", "https://www.meesho.com/blue-shorts", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));

        // Budget Male Shoes
        products.add(createProduct("Black Casual Slides", "Shoes", "Sparx", 199.0, "Black", "EVA", "https://www.meesho.com/slides", "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Blue Slip-on Canvas Shoes", "Shoes", "Bata", 299.0, "Blue", "Canvas", "https://www.meesho.com/canvas", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));

        // Budget Male Accessory
        products.add(createProduct("Retro Sunglasses", "Accessory", "Mast & Harbour", 149.0, "Black", "Plastic", "https://www.meesho.com/sunglasses", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("Black Woven Belt", "Accessory", "Roadster", 149.0, "Black", "Nylon", "https://www.meesho.com/belt", "https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?auto=format&fit=crop&w=400&q=80", "Meesho", 3.9));

        // Budget Female Top
        products.add(createProduct("Plain White Crop Top", "Top", "Savana", 249.0, "White", "Cotton", "https://www.meesho.com/crop-top", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("Plain Black Tank Top", "Top", "Savana", 199.0, "Black", "Cotton", "https://www.meesho.com/tank-top", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));
        products.add(createProduct("Floral Cotton Cami", "Top", "Savana", 299.0, "Multicolor", "Cotton", "https://www.meesho.com/cami", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", "Meesho", 4.0));

        // Budget Female Bottom
        products.add(createProduct("Beige Cotton Mini Skirt", "Bottom", "Savana", 299.0, "Beige", "Cotton", "https://www.meesho.com/skirt", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Black Cotton Palazzo", "Bottom", "Aurelia", 399.0, "Black", "Cotton", "https://www.meesho.com/palazzo", "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));

        // Budget Female Shoes
        products.add(createProduct("Casual Canvas Slides", "Shoes", "Bata", 199.0, "Beige", "Canvas", "https://www.meesho.com/slides", "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=400&q=80", "Meesho", 4.2));
        products.add(createProduct("White Striped Flip Flops", "Shoes", "Catwalk", 149.0, "White", "Rubber", "https://www.meesho.com/flipflops", "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=400&q=80", "Meesho", 3.8));

        // Budget Female Accessory
        products.add(createProduct("Canvas Cotton Tote Bag", "Accessory", "Mast & Harbour", 199.0, "Off-White", "Canvas", "https://www.meesho.com/tote", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80", "Meesho", 4.3));
        products.add(createProduct("Golden Hoop Earrings", "Accessory", "YouBella", 149.0, "Gold", "Alloy", "https://www.meesho.com/hoops", "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80", "Meesho", 4.1));

        productRepository.saveAll(products);
    }

    private Product createProduct(String name, String category, String brand, Double price, String color, String material, String url, String imageUrl, String marketplace, Double rating) {
        return Product.builder()
                .name(name)
                .category(category)
                .brand(brand)
                .price(price)
                .color(color)
                .material(material)
                .productUrl(url)
                .imageUrl(imageUrl)
                .marketplace(marketplace)
                .rating(rating)
                .build();
    }

    public List<Product> searchAndRankProducts(String query, String budgetBracket) {
        // Search DB by query tokens
        String[] tokens = query.split("\\s+");
        List<Product> matches = new ArrayList<>();

        if (tokens.length > 0) {
            matches = productRepository.searchProducts(tokens[0]);
            // If multiple tokens exist, filter / intersect matches to narrow down
            for (int i = 1; i < tokens.length; i++) {
                String token = tokens[i].toLowerCase();
                matches = matches.stream()
                        .filter(p -> p.getName().toLowerCase().contains(token) || 
                                     p.getCategory().toLowerCase().contains(token) ||
                                     p.getColor().toLowerCase().contains(token) ||
                                     p.getBrand().toLowerCase().contains(token))
                        .collect(Collectors.toList());
            }
        }

        // Identify category based on the query contents
        String lowercaseQuery = query.toLowerCase();
        String matchedCategory = "Top";
        if (lowercaseQuery.contains("pants") || lowercaseQuery.contains("trouser") || lowercaseQuery.contains("chinos") || lowercaseQuery.contains("skirt") || lowercaseQuery.contains("shorts") || lowercaseQuery.contains("palazzo") || lowercaseQuery.contains("bottom")) {
            matchedCategory = "Bottom";
        } else if (lowercaseQuery.contains("shoes") || lowercaseQuery.contains("sneakers") || lowercaseQuery.contains("flats") || lowercaseQuery.contains("boots") || lowercaseQuery.contains("mojaris") || lowercaseQuery.contains("heel") || lowercaseQuery.contains("slides") || lowercaseQuery.contains("espadrilles")) {
            matchedCategory = "Shoes";
        } else if (lowercaseQuery.contains("watch") || lowercaseQuery.contains("belt") || lowercaseQuery.contains("bag") || lowercaseQuery.contains("sunglasses") || lowercaseQuery.contains("earrings") || lowercaseQuery.contains("chain") || lowercaseQuery.contains("necklace") || lowercaseQuery.contains("accessory") || lowercaseQuery.contains("jhumka") || lowercaseQuery.contains("choker") || lowercaseQuery.contains("tote")) {
            matchedCategory = "Accessory";
        }

        List<Product> categoryFallbacks = productRepository.findByCategoryIgnoreCase(matchedCategory);

        // Merge lists: specific keyword matches first, then other products from the same category
        List<Product> combinedCandidates = new ArrayList<>(matches);
        for (Product p : categoryFallbacks) {
            if (combinedCandidates.stream().noneMatch(c -> c.getId().equals(p.getId()))) {
                combinedCandidates.add(p);
            }
        }

        // Parse price limits from budget bracket
        double maxPrice = ruleEngine.parseMaxBudget(budgetBracket);

        // Filter and Rank products: Sort by rating descending, matches below budget first
        final double limitPrice = maxPrice;
        return combinedCandidates.stream()
                .filter(p -> p.getPrice() <= limitPrice)
                .sorted(Comparator.comparingDouble(Product::getRating).reversed())
                .limit(20)
                .collect(Collectors.toList());
    }

    // Wishlist Operations
    @Transactional
    public Wishlist addToWishlist(User user, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return wishlistRepository.findByUserIdAndProductId(user.getId(), productId).orElse(null);
        }

        Wishlist item = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
        return wishlistRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(User user, UUID productId) {
        Wishlist item = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found in wishlist"));
        wishlistRepository.delete(item);
    }

    public List<Wishlist> getWishlist(User user) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
