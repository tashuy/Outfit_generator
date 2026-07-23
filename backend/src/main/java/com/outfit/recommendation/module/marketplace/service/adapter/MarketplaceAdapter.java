package com.outfit.recommendation.module.marketplace.service.adapter;

import com.outfit.recommendation.module.marketplace.model.Product;
import java.util.List;

public interface MarketplaceAdapter {
    String getMarketplaceName();
    List<Product> fetchProducts(String query, String budgetBracket);
}
