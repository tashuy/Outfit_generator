package com.outfit.recommendation.module.marketplace.service.adapter;

import com.outfit.recommendation.module.marketplace.model.Product;
import com.outfit.recommendation.module.marketplace.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MockMarketplaceAdapter implements MarketplaceAdapter {

    @Autowired
    private ProductService productService;

    @Override
    public String getMarketplaceName() {
        return "MockCatalog";
    }

    @Override
    public List<Product> fetchProducts(String query, String budgetBracket) {
        return productService.searchAndRankProducts(query, budgetBracket);
    }
}
