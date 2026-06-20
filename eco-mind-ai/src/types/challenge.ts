// ===========================================
// Challenge & Gamification Types — ECO MIND AI
// ===========================================

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'active' | 'completed' | 'expired';

export interface WeeklyChallenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetCO2Savings: number;
  difficulty: ChallengeDifficulty;
  rewardPoints: number;
  status: ChallengeStatus;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  goalKg: number;
  currentProgressKg: number;
  participantCount: number;
  participants: CommunityParticipant[];
  startDate: string;
  endDate: string;
  reward: string;
  isActive: boolean;
}

export interface CommunityParticipant {
  userId: string;
  displayName: string;
  photoURL: string;
  contributionKg: number;
}

export type BadgeId =
  | 'green-beginner'
  | 'eco-warrior'
  | 'climate-hero'
  | 'planet-guardian'
  | 'streak-7'
  | 'streak-30'
  | 'carbon-master'
  | 'journal-keeper'
  | 'community-champion'
  | 'bill-detective'
  | 'receipt-scanner'
  | 'simulator-pro';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned: boolean;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: BadgeId;
  badgeName: string;
  description: string;
  earnedAt: string;
}

export interface GamificationState {
  ecoPoints: number;
  streakDays: number;
  badges: Badge[];
  achievements: Achievement[];
  rank: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  content: string;
  category: string;
  potentialSavingKg: number;
  dismissed: boolean;
  generatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'streak' | 'badge' | 'challenge' | 'quiz' | 'tip';
  read: boolean;
  createdAt: string;
}
