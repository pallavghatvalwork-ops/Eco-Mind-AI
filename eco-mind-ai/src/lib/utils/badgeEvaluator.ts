// ===========================================
// Badge Evaluator Utility — ECO MIND AI
// ===========================================

export interface UserStatsForBadge {
  streakDays: number;
  ecoPoints: number;
  carbonScore: number;
  onboardingComplete: boolean;
  journalEntriesCount: number;
  completedChallengesCount: number;
  billScansCount: number;
  receiptScansCount: number;
  simulatorScenariosCount: number;
  communityChallengesCount: number;
}

/**
 * Evaluate if a specific badge is earned based on user statistics.
 */
export function evaluateBadge(badgeId: string, stats: UserStatsForBadge): boolean {
  switch (badgeId) {
    case 'green-beginner':
      return stats.onboardingComplete;
    case 'eco-warrior':
      return stats.carbonScore >= 70;
    case 'climate-hero':
      return stats.carbonScore >= 90;
    case 'planet-guardian':
      return stats.carbonScore >= 90 && stats.streakDays >= 30;
    case 'streak-7':
      return stats.streakDays >= 7;
    case 'streak-30':
      return stats.streakDays >= 30;
    case 'carbon-master':
      return stats.simulatorScenariosCount >= 1 && stats.carbonScore >= 80;
    case 'journal-keeper':
      return stats.journalEntriesCount >= 10;
    case 'community-champion':
      return stats.communityChallengesCount >= 3;
    case 'bill-detective':
      return stats.billScansCount >= 5;
    case 'receipt-scanner':
      return stats.receiptScansCount >= 10;
    case 'simulator-pro':
      return stats.simulatorScenariosCount >= 5;
    default:
      return false;
  }
}
