package com.outfit.recommendation.module.recommendation.service;

import org.springframework.stereotype.Service;

@Service
public class RuleEngine {

    public double parseMaxBudget(String budgetBracket) {
        if (budgetBracket == null) return Double.MAX_VALUE;
        String val = budgetBracket.toLowerCase();
        if (val.contains("under 999") || val.contains("999")) {
            return 999.0;
        } else if (val.contains("1000-2000") || val.contains("2000")) {
            return 2000.0;
        } else if (val.contains("2000-5000") || val.contains("5000")) {
            return 5000.0;
        } else {
            return Double.MAX_VALUE;
        }
    }

    public boolean validateOccasionRule(String occasion, String itemDescription) {
        if (occasion == null || itemDescription == null) return true;
        
        String desc = itemDescription.toLowerCase();
        String occ = occasion.toLowerCase();
        
        if (occ.contains("wedding")) {
            return desc.contains("kurta") || desc.contains("sherwani") || desc.contains("mojaris") || desc.contains("jhumka") || desc.contains("silk") || desc.contains("heel") || desc.contains("trousers") || desc.contains("shirt") || desc.contains("gold");
        }
        if (occ.contains("vacation")) {
            return desc.contains("linen") || desc.contains("shorts") || desc.contains("sandals") || desc.contains("sunglasses") || desc.contains("floral") || desc.contains("shirt") || desc.contains("skirt");
        }
        return true;
    }
}
