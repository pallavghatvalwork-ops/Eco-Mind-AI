// ===========================================
// User Types — ECO MIND AI
// ===========================================

import { Notification } from './challenge';

export type TransportMode = 'walking' | 'bicycle' | 'bus' | 'train' | 'metro' | 'car' | 'motorcycle' | 'flight';

export type FoodHabit = 'vegetarian' | 'vegan' | 'mixed' | 'non-vegetarian';

export type RecyclingLevel = 'none' | 'partial' | 'full';

export type ShoppingFrequency = 'rarely' | 'monthly' | 'weekly' | 'daily';

export type CarbonCategory = 'Climate Champion' | 'Eco Warrior' | 'Green Beginner' | 'High Impact User';

export interface TransportPreferences {
  primaryModes: TransportMode[];
  dailyCommuteKm: number;
  monthlyFlights: number;
}

export interface EnergyPreferences {
  electricityUnitsPerMonth: number;
  acHoursPerDay: number;
  waterConsumptionLiters: number;
}

export interface FoodPreferences {
  dietType: FoodHabit;
}

export interface ShoppingPreferences {
  onlineOrdersPerMonth: number;
  fastFashionItemsPerMonth: number;
}

export interface WastePreferences {
  recyclingLevel: RecyclingLevel;
  composting: boolean;
}

export interface UserPreferences {
  transport: TransportPreferences;
  energy: EnergyPreferences;
  food: FoodPreferences;
  shopping: ShoppingPreferences;
  waste: WastePreferences;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  preferences: UserPreferences | null;
  carbonScore: number;
  carbonCategory: CarbonCategory;
  ecoPoints: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
  onboardingComplete: boolean;
  
  // Optional statistics for dynamic badge verification and features
  journalEntriesCount?: number;
  completedChallengesCount?: number;
  billScansCount?: number;
  receiptScansCount?: number;
  simulatorScenariosCount?: number;
  communityChallengesCount?: number;
  quizCompleted?: boolean;
  joinedChallenges?: string[];
  notifications?: Notification[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string;
  ecoPoints: number;
  carbonScore: number;
  rank: number;
  updatedAt: string;
}
