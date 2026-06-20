// ===========================================
// Carbon Scoring System — ECO MIND AI
// ===========================================

import type { CarbonCategory } from '@/types/user';

/**
 * Calculate Carbon Score (0-100) from monthly emissions.
 *
 * Formula:
 *   Score = max(0, min(100, 100 - ((emission - 50) / 200) * 100))
 *
 * Lower emissions → higher score.
 * 50 kg/month = perfect 100 score
 * 250+ kg/month = 0 score
 */
export function calculateCarbonScore(monthlyEmissionKg: number): number {
  const score = 100 - ((monthlyEmissionKg - 50) / 200) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Get category label from carbon score.
 */
export function getCarbonCategory(score: number): CarbonCategory {
  if (score >= 90) return 'Climate Champion';
  if (score >= 70) return 'Eco Warrior';
  if (score >= 50) return 'Green Beginner';
  return 'High Impact User';
}

/**
 * Get category details with emoji, color, and description.
 */
export function getCarbonCategoryDetails(score: number) {
  const category = getCarbonCategory(score);

  const details = {
    'Climate Champion': {
      emoji: '🏆',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      description: 'Outstanding! Your carbon footprint is remarkably low.',
      tips: 'Keep inspiring others and maintain your sustainable lifestyle.',
    },
    'Eco Warrior': {
      emoji: '🌿',
      color: '#4ade80',
      bgColor: 'rgba(74, 222, 128, 0.15)',
      description: 'Great job! You\'re making a real difference.',
      tips: 'A few more changes could make you a Climate Champion.',
    },
    'Green Beginner': {
      emoji: '🌱',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      description: 'Good start! There\'s room for improvement.',
      tips: 'Focus on your highest-emission categories for quick wins.',
    },
    'High Impact User': {
      emoji: '⚠️',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      description: 'Your footprint is above average. Let\'s work on reducing it.',
      tips: 'Start with simple changes like reducing car travel and energy usage.',
    },
  };

  return {
    category,
    ...details[category],
  };
}

/**
 * Get the score ring color based on the score value.
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#4ade80';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

/**
 * Calculate eco points earned from carbon reduction.
 * 1 kg CO₂ saved = 10 eco points
 */
export function calculateEcoPoints(savedKgCO2: number): number {
  return Math.round(savedKgCO2 * 10);
}
