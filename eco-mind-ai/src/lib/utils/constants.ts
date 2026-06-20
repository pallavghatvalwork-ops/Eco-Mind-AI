// ===========================================
// App Constants — ECO MIND AI
// ===========================================

export const APP_NAME = 'ECO MIND AI';
export const APP_TAGLINE = 'Understand. Track. Reduce.';
export const APP_DESCRIPTION = 'AI-Powered Carbon Footprint Awareness Platform that helps individuals understand, track, and reduce their carbon footprint through personalized insights and AI recommendations.';

// Navigation items for the sidebar
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Activity Tracker', href: '/tracker', icon: 'MessageSquareText' },
  { label: 'Green Journal', href: '/journal', icon: 'BookOpen' },
  { label: 'Bill Analyzer', href: '/bills', icon: 'Receipt' },
  { label: 'Receipt Scanner', href: '/receipts', icon: 'ScanLine' },
  { label: 'Challenges', href: '/challenges', icon: 'Target' },
  { label: 'Community', href: '/community', icon: 'Users' },
  { label: 'Simulator', href: '/simulator', icon: 'SlidersHorizontal' },
  { label: 'Achievements', href: '/achievements', icon: 'Trophy' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'Medal' },
  { label: 'Forecast', href: '/forecast', icon: 'TrendingUp' },
  { label: 'Learning Hub', href: '/learn', icon: 'GraduationCap' },
  { label: 'AI Transparency', href: '/transparency', icon: 'Brain' },
] as const;

// Badge definitions
export const BADGES = [
  {
    id: 'green-beginner' as const,
    name: 'Green Beginner',
    description: 'Complete your first carbon footprint assessment',
    icon: '🌱',
    requirement: 'Complete onboarding',
  },
  {
    id: 'eco-warrior' as const,
    name: 'Eco Warrior',
    description: 'Achieve a carbon score of 70 or above',
    icon: '🌿',
    requirement: 'Carbon score ≥ 70',
  },
  {
    id: 'climate-hero' as const,
    name: 'Climate Hero',
    description: 'Achieve a carbon score of 90 or above',
    icon: '🏆',
    requirement: 'Carbon score ≥ 90',
  },
  {
    id: 'planet-guardian' as const,
    name: 'Planet Guardian',
    description: 'Maintain Climate Champion status for 30 days',
    icon: '🌍',
    requirement: '30 days as Climate Champion',
  },
  {
    id: 'streak-7' as const,
    name: '7 Day Green Streak',
    description: 'Log activities for 7 consecutive days',
    icon: '🔥',
    requirement: '7-day activity streak',
  },
  {
    id: 'streak-30' as const,
    name: '30 Day Eco Challenge',
    description: 'Log activities for 30 consecutive days',
    icon: '⭐',
    requirement: '30-day activity streak',
  },
  {
    id: 'carbon-master' as const,
    name: 'Carbon Reduction Master',
    description: 'Reduce monthly emissions by 25%',
    icon: '📉',
    requirement: '25% emission reduction',
  },
  {
    id: 'journal-keeper' as const,
    name: 'Journal Keeper',
    description: 'Write 10 daily green journal entries',
    icon: '📔',
    requirement: '10 journal entries',
  },
  {
    id: 'community-champion' as const,
    name: 'Community Champion',
    description: 'Contribute to 3 community challenges',
    icon: '🤝',
    requirement: '3 community challenges',
  },
  {
    id: 'bill-detective' as const,
    name: 'Bill Detective',
    description: 'Analyze 5 utility bills with AI',
    icon: '🔍',
    requirement: '5 bills analyzed',
  },
  {
    id: 'receipt-scanner' as const,
    name: 'Receipt Scanner Pro',
    description: 'Scan 10 shopping receipts',
    icon: '🧾',
    requirement: '10 receipts scanned',
  },
  {
    id: 'simulator-pro' as const,
    name: 'Simulator Pro',
    description: 'Create 5 different lifestyle scenarios',
    icon: '🔬',
    requirement: '5 simulations created',
  },
];

// Learning Hub topics
export const LEARNING_TOPICS = [
  {
    id: 'climate-basics',
    title: 'Climate Change Basics',
    icon: '🌡️',
    color: '#ef4444',
    description: 'Understanding global warming and its effects',
  },
  {
    id: 'carbon-guide',
    title: 'Carbon Footprint Guide',
    icon: '👣',
    color: '#f59e0b',
    description: 'What is a carbon footprint and how to measure it',
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    icon: '⚡',
    color: '#22c55e',
    description: 'Solar, wind, and other clean energy sources',
  },
  {
    id: 'recycling',
    title: 'Recycling Tips',
    icon: '♻️',
    color: '#3b82f6',
    description: 'Reduce, reuse, recycle effectively',
  },
  {
    id: 'transport',
    title: 'Sustainable Transportation',
    icon: '🚲',
    color: '#8b5cf6',
    description: 'Greener ways to get around',
  },
  {
    id: 'green-lifestyle',
    title: 'Green Lifestyle Tips',
    icon: '🌿',
    color: '#06b6d4',
    description: 'Daily habits for a sustainable life',
  },
];

// Onboarding step metadata
export const ONBOARDING_STEPS = [
  { id: 'transport', title: 'Transportation', icon: '🚗', description: 'How do you get around?' },
  { id: 'energy', title: 'Home Energy', icon: '⚡', description: 'Your energy consumption' },
  { id: 'food', title: 'Food Habits', icon: '🍽️', description: 'What do you eat?' },
  { id: 'shopping', title: 'Shopping', icon: '🛒', description: 'Your shopping patterns' },
  { id: 'waste', title: 'Waste Management', icon: '♻️', description: 'How you handle waste' },
];

// Transport mode options for onboarding
export const TRANSPORT_MODES = [
  { id: 'walking', label: 'Walking', icon: '🚶', emission: '0 CO₂' },
  { id: 'bicycle', label: 'Bicycle', icon: '🚲', emission: '0 CO₂' },
  { id: 'bus', label: 'Bus', icon: '🚌', emission: 'Low' },
  { id: 'train', label: 'Train', icon: '🚂', emission: 'Low' },
  { id: 'metro', label: 'Metro', icon: '🚇', emission: 'Very Low' },
  { id: 'car', label: 'Car', icon: '🚗', emission: 'High' },
  { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️', emission: 'Medium' },
  { id: 'flight', label: 'Flight', icon: '✈️', emission: 'Very High' },
];
