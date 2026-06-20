import { describe, it, expect } from 'vitest';
import {
  calculateCarbonScore,
  getCarbonCategory,
  getCarbonCategoryDetails,
  getScoreColor,
  calculateEcoPoints
} from './scoring';

describe('scoring utilities', () => {
  describe('calculateCarbonScore', () => {
    it('should return 100 for emissions <= 50 kg/month', () => {
      expect(calculateCarbonScore(50)).toBe(100);
      expect(calculateCarbonScore(30)).toBe(100);
    });

    it('should return 0 for emissions >= 250 kg/month', () => {
      expect(calculateCarbonScore(250)).toBe(0);
      expect(calculateCarbonScore(300)).toBe(0);
    });

    it('should calculate linearly between 50 and 250 kg/month', () => {
      expect(calculateCarbonScore(150)).toBe(50);
      expect(calculateCarbonScore(100)).toBe(75);
      expect(calculateCarbonScore(200)).toBe(25);
    });
  });

  describe('getCarbonCategory', () => {
    it('should categorize correctly based on score thresholds', () => {
      expect(getCarbonCategory(95)).toBe('Climate Champion');
      expect(getCarbonCategory(90)).toBe('Climate Champion');
      expect(getCarbonCategory(85)).toBe('Eco Warrior');
      expect(getCarbonCategory(70)).toBe('Eco Warrior');
      expect(getCarbonCategory(60)).toBe('Green Beginner');
      expect(getCarbonCategory(50)).toBe('Green Beginner');
      expect(getCarbonCategory(45)).toBe('High Impact User');
      expect(getCarbonCategory(10)).toBe('High Impact User');
    });
  });

  describe('getCarbonCategoryDetails', () => {
    it('should return appropriate details for each score', () => {
      const champion = getCarbonCategoryDetails(92);
      expect(champion.category).toBe('Climate Champion');
      expect(champion.emoji).toBe('🏆');
      expect(champion.color).toBe('#22c55e');

      const warrior = getCarbonCategoryDetails(75);
      expect(warrior.category).toBe('Eco Warrior');
      expect(warrior.emoji).toBe('🌿');

      const beginner = getCarbonCategoryDetails(55);
      expect(beginner.category).toBe('Green Beginner');
      expect(beginner.emoji).toBe('🌱');

      const highImpact = getCarbonCategoryDetails(20);
      expect(highImpact.category).toBe('High Impact User');
      expect(highImpact.emoji).toBe('⚠️');
    });
  });

  describe('getScoreColor', () => {
    it('should return correct color hex code', () => {
      expect(getScoreColor(92)).toBe('#22c55e');
      expect(getScoreColor(80)).toBe('#4ade80');
      expect(getScoreColor(60)).toBe('#f59e0b');
      expect(getScoreColor(30)).toBe('#ef4444');
    });
  });

  describe('calculateEcoPoints', () => {
    it('should return 10 times the kg value saved', () => {
      expect(calculateEcoPoints(5)).toBe(50);
      expect(calculateEcoPoints(12.34)).toBe(123);
      expect(calculateEcoPoints(0)).toBe(0);
    });
  });
});
