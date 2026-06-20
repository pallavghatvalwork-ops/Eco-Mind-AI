// ===========================================
// Carbon Calculation Types — ECO MIND AI
// ===========================================

export interface CarbonBreakdown {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
}

export interface CarbonReport {
  id: string;
  userId: string;
  period: string; // YYYY-MM
  totalEmission: number;
  breakdown: CarbonBreakdown;
  carbonScore: number;
  category: string;
  generatedAt: string;
}

export interface CarbonForecast {
  currentYearlyEmission: number;
  projectedYearlyEmission: number;
  potentialReduction: number;
  monthlyData: MonthlyForecastPoint[];
}

export interface MonthlyForecastPoint {
  month: string;
  currentTrend: number;
  projectedTrend: number;
  potentialSavings: number;
}

export interface SimulatorScenario {
  id: string;
  name: string;
  changes: SimulatorChange[];
  monthlyReduction: number;
  yearlyReduction: number;
  percentageImprovement: number;
}

export interface SimulatorChange {
  category: string;
  fromAction: string;
  toAction: string;
  monthlySavingKg: number;
}

export interface WhyThisMattersData {
  annualFootprintKg: number;
  treesNeededToOffset: number;
  equivalentKmDriven: number;
  potentialYearlyReduction: number;
  globalAverageKg: number;
  indiaAverageKg: number;
}

export interface EmissionFactor {
  category: string;
  activity: string;
  factor: number;
  unit: string;
  region: string;
}
