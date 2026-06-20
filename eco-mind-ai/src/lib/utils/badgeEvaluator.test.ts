import { describe, it, expect } from 'vitest';
import { evaluateBadge, UserStatsForBadge } from './badgeEvaluator';

const createEmptyStats = (): UserStatsForBadge => ({
  streakDays: 0,
  ecoPoints: 0,
  carbonScore: 0,
  onboardingComplete: false,
  journalEntriesCount: 0,
  completedChallengesCount: 0,
  billScansCount: 0,
  receiptScansCount: 0,
  simulatorScenariosCount: 0,
  communityChallengesCount: 0,
});

describe('badgeEvaluator', () => {
  it('should evaluate green-beginner based on onboardingComplete', () => {
    const stats = createEmptyStats();
    expect(evaluateBadge('green-beginner', stats)).toBe(false);
    
    stats.onboardingComplete = true;
    expect(evaluateBadge('green-beginner', stats)).toBe(true);
  });

  it('should evaluate eco-warrior based on carbonScore >= 70', () => {
    const stats = createEmptyStats();
    stats.carbonScore = 69;
    expect(evaluateBadge('eco-warrior', stats)).toBe(false);
    
    stats.carbonScore = 70;
    expect(evaluateBadge('eco-warrior', stats)).toBe(true);
    
    stats.carbonScore = 85;
    expect(evaluateBadge('eco-warrior', stats)).toBe(true);
  });

  it('should evaluate climate-hero based on carbonScore >= 90', () => {
    const stats = createEmptyStats();
    stats.carbonScore = 89;
    expect(evaluateBadge('climate-hero', stats)).toBe(false);
    
    stats.carbonScore = 90;
    expect(evaluateBadge('climate-hero', stats)).toBe(true);
  });

  it('should evaluate planet-guardian based on carbonScore >= 90 and streakDays >= 30', () => {
    const stats = createEmptyStats();
    stats.carbonScore = 95;
    stats.streakDays = 29;
    expect(evaluateBadge('planet-guardian', stats)).toBe(false);

    stats.carbonScore = 89;
    stats.streakDays = 35;
    expect(evaluateBadge('planet-guardian', stats)).toBe(false);

    stats.carbonScore = 90;
    stats.streakDays = 30;
    expect(evaluateBadge('planet-guardian', stats)).toBe(true);
  });

  it('should evaluate streak-7 based on streakDays >= 7', () => {
    const stats = createEmptyStats();
    stats.streakDays = 6;
    expect(evaluateBadge('streak-7', stats)).toBe(false);

    stats.streakDays = 7;
    expect(evaluateBadge('streak-7', stats)).toBe(true);
  });

  it('should evaluate streak-30 based on streakDays >= 30', () => {
    const stats = createEmptyStats();
    stats.streakDays = 29;
    expect(evaluateBadge('streak-30', stats)).toBe(false);

    stats.streakDays = 30;
    expect(evaluateBadge('streak-30', stats)).toBe(true);
  });

  it('should evaluate carbon-master based on simulatorScenariosCount >= 1 and carbonScore >= 80', () => {
    const stats = createEmptyStats();
    stats.simulatorScenariosCount = 0;
    stats.carbonScore = 85;
    expect(evaluateBadge('carbon-master', stats)).toBe(false);

    stats.simulatorScenariosCount = 1;
    stats.carbonScore = 79;
    expect(evaluateBadge('carbon-master', stats)).toBe(false);

    stats.simulatorScenariosCount = 1;
    stats.carbonScore = 80;
    expect(evaluateBadge('carbon-master', stats)).toBe(true);
  });

  it('should evaluate journal-keeper based on journalEntriesCount >= 10', () => {
    const stats = createEmptyStats();
    stats.journalEntriesCount = 9;
    expect(evaluateBadge('journal-keeper', stats)).toBe(false);

    stats.journalEntriesCount = 10;
    expect(evaluateBadge('journal-keeper', stats)).toBe(true);
  });

  it('should evaluate community-champion based on communityChallengesCount >= 3', () => {
    const stats = createEmptyStats();
    stats.communityChallengesCount = 2;
    expect(evaluateBadge('community-champion', stats)).toBe(false);

    stats.communityChallengesCount = 3;
    expect(evaluateBadge('community-champion', stats)).toBe(true);
  });

  it('should evaluate bill-detective based on billScansCount >= 5', () => {
    const stats = createEmptyStats();
    stats.billScansCount = 4;
    expect(evaluateBadge('bill-detective', stats)).toBe(false);

    stats.billScansCount = 5;
    expect(evaluateBadge('bill-detective', stats)).toBe(true);
  });

  it('should evaluate receipt-scanner based on receiptScansCount >= 10', () => {
    const stats = createEmptyStats();
    stats.receiptScansCount = 9;
    expect(evaluateBadge('receipt-scanner', stats)).toBe(false);

    stats.receiptScansCount = 10;
    expect(evaluateBadge('receipt-scanner', stats)).toBe(true);
  });

  it('should evaluate simulator-pro based on simulatorScenariosCount >= 5', () => {
    const stats = createEmptyStats();
    stats.simulatorScenariosCount = 4;
    expect(evaluateBadge('simulator-pro', stats)).toBe(false);

    stats.simulatorScenariosCount = 5;
    expect(evaluateBadge('simulator-pro', stats)).toBe(true);
  });

  it('should return false for unknown badge IDs', () => {
    const stats = createEmptyStats();
    stats.onboardingComplete = true;
    expect(evaluateBadge('unknown-badge-id', stats)).toBe(false);
  });
});
