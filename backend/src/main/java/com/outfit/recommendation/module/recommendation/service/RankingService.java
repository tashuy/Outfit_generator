package com.outfit.recommendation.module.recommendation.service;

import com.outfit.recommendation.module.marketplace.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingService {

    public static class CombinationResult {
        public List<Product> products = null;
        public double totalCost = Double.MAX_VALUE;
        public double avgRating = 0.0;
    }

    public CombinationResult getBestCombination(List<List<Product>> candidatesList, double maxBudget) {
        CombinationResult best = new CombinationResult();
        findBestCombination(candidatesList, 0, new ArrayList<>(), best, maxBudget);
        return best;
    }

    private void findBestCombination(List<List<Product>> candidatesList, int index, List<Product> current, CombinationResult best, double maxBudget) {
        if (index == candidatesList.size()) {
            double totalCost = 0.0;
            double totalRating = 0.0;
            int ratedCount = 0;
            for (Product p : current) {
                if (p != null) {
                    totalCost += p.getPrice();
                    totalRating += p.getRating();
                    ratedCount++;
                }
            }
            double avgRating = ratedCount > 0 ? totalRating / ratedCount : 0.0;

            if (totalCost <= maxBudget) {
                // If under budget, maximize average rating, then minimize cost
                if (best.products == null || best.totalCost > maxBudget || avgRating > best.avgRating || (avgRating == best.avgRating && totalCost < best.totalCost)) {
                    best.products = new ArrayList<>(current);
                    best.totalCost = totalCost;
                    best.avgRating = avgRating;
                }
            } else {
                // Fallback: choose the lowest total cost if no combination is under budget
                if (best.products == null || (best.totalCost > maxBudget && totalCost < best.totalCost)) {
                    best.products = new ArrayList<>(current);
                    best.totalCost = totalCost;
                    best.avgRating = avgRating;
                }
            }
            return;
        }

        List<Product> options = candidatesList.get(index);
        if (options.isEmpty()) {
            current.add(null);
            findBestCombination(candidatesList, index + 1, current, best, maxBudget);
            current.remove(current.size() - 1);
        } else {
            for (Product option : options) {
                current.add(option);
                findBestCombination(candidatesList, index + 1, current, best, maxBudget);
                current.remove(current.size() - 1);
            }
        }
    }
}
