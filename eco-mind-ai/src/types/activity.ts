// ===========================================
// Activity Types — ECO MIND AI
// ===========================================

export type ActivityCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'waste';

export type ActivitySource = 'manual' | 'nlp' | 'bill' | 'receipt' | 'journal';

export interface ParsedTransportActivity {
  mode: string;
  distanceKm: number;
}

export interface ParsedFoodActivity {
  mealType: string;
  dietType: string;
}

export interface ParsedEnergyActivity {
  type: string;
  unitsOrHours: number;
}

export interface ParsedShoppingActivity {
  itemType: string;
  quantity: number;
}

export interface ParsedWasteActivity {
  action: string;
}

export type ParsedActivityData =
  | ParsedTransportActivity
  | ParsedFoodActivity
  | ParsedEnergyActivity
  | ParsedShoppingActivity
  | ParsedWasteActivity;

export interface Activity {
  id: string;
  userId: string;
  rawInput: string;
  category: ActivityCategory;
  parsedData: ParsedActivityData;
  carbonKg: number;
  source: ActivitySource;
  date: string;
  createdAt: string;
}

export interface DetectedActivity {
  category: ActivityCategory;
  description: string;
  parsedData: ParsedActivityData;
  estimatedCarbonKg: number;
  confidence: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  rawText: string;
  date: string;
  detectedActivities: DetectedActivity[];
  totalCarbonKg: number;
  totalSavingsKg: number;
  aiEncouragement: string;
  createdAt: string;
}

export interface BillAnalysis {
  id: string;
  userId: string;
  fileUrl: string;
  fileType: 'pdf' | 'png' | 'jpg';
  extractedData: {
    unitsConsumed: number;
    billingAmount: number;
    billingPeriod: string;
    provider: string;
  };
  calculatedCarbonKg: number;
  verified: boolean;
  createdAt: string;
}

export interface ReceiptAnalysis {
  id: string;
  userId: string;
  fileUrl: string;
  items: ReceiptItem[];
  totalCarbonKg: number;
  recommendations: string[];
  createdAt: string;
}

export interface ReceiptItem {
  name: string;
  category: string;
  quantity: number;
  carbonImpactKg: number;
  sustainabilityRating: 'low' | 'medium' | 'high';
}
