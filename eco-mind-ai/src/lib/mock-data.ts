// ===========================================
// Mock Data Repository — ECO MIND AI
// ===========================================
// Provides realistic demo data for all features.
// Designed to be swapped with Firestore services later.

import type { User, UserPreferences } from '@/types/user';
import type { Activity } from '@/types/activity';
import type { CarbonReport, MonthlyForecastPoint } from '@/types/carbon';
import type { WeeklyChallenge, CommunityChallenge, Badge, Recommendation, Notification } from '@/types/challenge';
import { BADGES } from '@/lib/utils/constants';
import { calculateMonthlyEmissions, calculateTotalEmissions } from '@/lib/carbon/calculator';
import { calculateCarbonScore, getCarbonCategory } from '@/lib/carbon/scoring';

// ------------------------------------------
// Default user preferences (typical Indian user)
// ------------------------------------------
export const DEFAULT_PREFERENCES: UserPreferences = {
  transport: {
    primaryModes: ['car', 'metro'],
    dailyCommuteKm: 15,
    monthlyFlights: 0,
  },
  energy: {
    electricityUnitsPerMonth: 250,
    acHoursPerDay: 4,
    waterConsumptionLiters: 150,
  },
  food: {
    dietType: 'mixed',
  },
  shopping: {
    onlineOrdersPerMonth: 4,
    fastFashionItemsPerMonth: 1,
  },
  waste: {
    recyclingLevel: 'partial',
    composting: false,
  },
};

// Calculate emissions from defaults
const defaultBreakdown = calculateMonthlyEmissions(DEFAULT_PREFERENCES);
const defaultTotal = calculateTotalEmissions(defaultBreakdown);
const defaultScore = calculateCarbonScore(defaultTotal);

// ------------------------------------------
// Mock User
// ------------------------------------------
export const MOCK_USER: User = {
  uid: 'mock-user-001',
  displayName: 'Pallav Ghat',
  email: 'pallav@example.com',
  photoURL: '',
  preferences: DEFAULT_PREFERENCES,
  carbonScore: defaultScore,
  carbonCategory: getCarbonCategory(defaultScore),
  ecoPoints: 1250,
  streakDays: 12,
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  onboardingComplete: true,
};

// ------------------------------------------
// Mock Activities (last 30 days)
// ------------------------------------------
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    userId: 'mock-user-001',
    rawInput: 'Drove 12 km to office and used AC for 6 hours',
    category: 'transport',
    parsedData: { mode: 'car', distanceKm: 12 },
    carbonKg: 2.52,
    source: 'nlp',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-002',
    userId: 'mock-user-001',
    rawInput: 'Took metro to work today',
    category: 'transport',
    parsedData: { mode: 'metro', distanceKm: 15 },
    carbonKg: 0.5,
    source: 'nlp',
    date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'act-003',
    userId: 'mock-user-001',
    rawInput: 'Had vegetarian lunch and dinner',
    category: 'food',
    parsedData: { mealType: 'full day', dietType: 'vegetarian' },
    carbonKg: 3.81,
    source: 'nlp',
    date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'act-004',
    userId: 'mock-user-001',
    rawInput: 'Electricity bill: 280 units',
    category: 'energy',
    parsedData: { type: 'electricity', unitsOrHours: 280 },
    carbonKg: 229.6,
    source: 'bill',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'act-005',
    userId: 'mock-user-001',
    rawInput: 'Ordered clothes online from Myntra',
    category: 'shopping',
    parsedData: { itemType: 'fast_fashion', quantity: 2 },
    carbonKg: 21.5,
    source: 'manual',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

// ------------------------------------------
// Mock Carbon Reports (last 6 months)
// ------------------------------------------
export const MOCK_CARBON_REPORTS: CarbonReport[] = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (5 - i));
  const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  // Simulate gradual improvement
  const multiplier = 1 - (i * 0.04);
  const breakdown = {
    transport: Math.round(defaultBreakdown.transport * multiplier * 100) / 100,
    food: Math.round(defaultBreakdown.food * (1 - i * 0.02) * 100) / 100,
    energy: Math.round(defaultBreakdown.energy * multiplier * 100) / 100,
    shopping: Math.round(defaultBreakdown.shopping * (1 - i * 0.05) * 100) / 100,
    waste: Math.round(defaultBreakdown.waste * (1 - i * 0.03) * 100) / 100,
  };
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const score = calculateCarbonScore(total);

  return {
    id: `report-${period}`,
    userId: 'mock-user-001',
    period,
    totalEmission: Math.round(total * 100) / 100,
    breakdown,
    carbonScore: score,
    category: getCarbonCategory(score),
    generatedAt: date.toISOString(),
  };
});

// ------------------------------------------
// Mock Forecast Data
// ------------------------------------------
export const MOCK_FORECAST_DATA: MonthlyForecastPoint[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() + i);
  const month = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

  return {
    month,
    currentTrend: Math.round((defaultTotal - i * 3) * 100) / 100,
    projectedTrend: Math.round((defaultTotal - i * 8) * 100) / 100,
    potentialSavings: Math.round((defaultTotal - i * 15) * 100) / 100,
  };
});

// ------------------------------------------
// Mock Weekly Challenges
// ------------------------------------------
export const MOCK_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'ch-001',
    userId: 'mock-user-001',
    title: 'Walk 15km this week',
    description: 'Replace short car trips with walking. Track your steps and log walking activities.',
    targetCO2Savings: 3.15,
    difficulty: 'easy',
    rewardPoints: 50,
    status: 'active',
    progress: 65,
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
  },
  {
    id: 'ch-002',
    userId: 'mock-user-001',
    title: 'Reduce AC usage by 1 hour daily',
    description: 'Cut your AC usage from 4 hours to 3 hours per day. Use fans and natural ventilation.',
    targetCO2Savings: 8.61,
    difficulty: 'medium',
    rewardPoints: 100,
    status: 'active',
    progress: 40,
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
  },
  {
    id: 'ch-003',
    userId: 'mock-user-001',
    title: 'Go vegetarian for 3 days',
    description: 'Switch to vegetarian meals for 3 days this week to reduce food emissions.',
    targetCO2Savings: 5.46,
    difficulty: 'medium',
    rewardPoints: 75,
    status: 'active',
    progress: 33,
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
  },
];

// ------------------------------------------
// Mock Community Challenges
// ------------------------------------------
export const MOCK_COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'cc-001',
    title: 'COEP Sustainability Challenge',
    description: 'Join your college community in reducing 1000 kg CO₂ collectively this month!',
    goalKg: 1000,
    currentProgressKg: 742,
    participantCount: 125,
    participants: [
      { userId: '1', displayName: 'Arjun S.', photoURL: '', contributionKg: 45 },
      { userId: '2', displayName: 'Priya M.', photoURL: '', contributionKg: 38 },
      { userId: '3', displayName: 'Rahul K.', photoURL: '', contributionKg: 32 },
    ],
    startDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    reward: '🏆 Community Champion Badge + 500 Eco Points',
    isActive: true,
  },
  {
    id: 'cc-002',
    title: 'Green Commute Week',
    description: 'Use public transport or cycle to work for an entire week.',
    goalKg: 500,
    currentProgressKg: 312,
    participantCount: 89,
    participants: [],
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    reward: '🚲 Green Commuter Badge + 300 Eco Points',
    isActive: true,
  },
];

// ------------------------------------------
// Mock Badges (with earned status)
// ------------------------------------------
export const MOCK_BADGES: Badge[] = BADGES.map((badge) => ({
  ...badge,
  earned: ['green-beginner', 'streak-7', 'eco-warrior'].includes(badge.id),
  earnedAt: ['green-beginner', 'streak-7', 'eco-warrior'].includes(badge.id)
    ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
    : undefined,
}));

// ------------------------------------------
// Mock Recommendations
// ------------------------------------------
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-001',
    userId: 'mock-user-001',
    content: 'You drive 15km daily. Switching to public transport twice a week can reduce approximately 12kg CO₂ monthly. You can save fuel costs and improve sustainability.',
    category: 'transport',
    potentialSavingKg: 12,
    dismissed: false,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-002',
    userId: 'mock-user-001',
    content: 'Your AC usage of 4 hours/day is above average. Reducing by 1 hour and setting temperature to 26°C can save 36kg CO₂ monthly.',
    category: 'energy',
    potentialSavingKg: 36,
    dismissed: false,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-003',
    userId: 'mock-user-001',
    content: 'Try having 2 vegetarian days per week. This simple change can reduce your food carbon footprint by 15% — that\'s about 25kg CO₂/month.',
    category: 'food',
    potentialSavingKg: 25,
    dismissed: false,
    generatedAt: new Date().toISOString(),
  },
];

// ------------------------------------------
// Mock Notifications
// ------------------------------------------
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'mock-user-001',
    title: '🔥 12-Day Streak!',
    message: 'You\'ve been tracking activities for 12 days straight. Keep it up to earn the 30-Day Eco Challenge badge!',
    type: 'milestone',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-002',
    userId: 'mock-user-001',
    title: '💡 Daily Eco Tip',
    message: 'Unplug devices when not in use. Standby power can account for 5-10% of household electricity consumption.',
    type: 'tip',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-003',
    userId: 'mock-user-001',
    title: '🎯 Challenge Update',
    message: 'You\'re 65% through the "Walk 15km" challenge. Only 5.25km to go!',
    type: 'challenge',
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ------------------------------------------
// Mock Leaderboard
// ------------------------------------------
export const MOCK_LEADERBOARD = [
  { userId: '1', displayName: 'Ananya R.', photoURL: '', ecoPoints: 3420, carbonScore: 92, rank: 1, updatedAt: new Date().toISOString() },
  { userId: '2', displayName: 'Vikram P.', photoURL: '', ecoPoints: 2890, carbonScore: 88, rank: 2, updatedAt: new Date().toISOString() },
  { userId: '3', displayName: 'Priya S.', photoURL: '', ecoPoints: 2650, carbonScore: 85, rank: 3, updatedAt: new Date().toISOString() },
  { userId: '4', displayName: 'Arjun M.', photoURL: '', ecoPoints: 2100, carbonScore: 79, rank: 4, updatedAt: new Date().toISOString() },
  { userId: 'mock-user-001', displayName: 'Pallav G.', photoURL: '', ecoPoints: 1250, carbonScore: defaultScore, rank: 5, updatedAt: new Date().toISOString() },
  { userId: '5', displayName: 'Sneha K.', photoURL: '', ecoPoints: 1100, carbonScore: 71, rank: 6, updatedAt: new Date().toISOString() },
  { userId: '6', displayName: 'Rohan D.', photoURL: '', ecoPoints: 980, carbonScore: 65, rank: 7, updatedAt: new Date().toISOString() },
  { userId: '7', displayName: 'Kavya L.', photoURL: '', ecoPoints: 850, carbonScore: 62, rank: 8, updatedAt: new Date().toISOString() },
  { userId: '8', displayName: 'Amit T.', photoURL: '', ecoPoints: 720, carbonScore: 58, rank: 9, updatedAt: new Date().toISOString() },
  { userId: '9', displayName: 'Neha G.', photoURL: '', ecoPoints: 650, carbonScore: 55, rank: 10, updatedAt: new Date().toISOString() },
];
