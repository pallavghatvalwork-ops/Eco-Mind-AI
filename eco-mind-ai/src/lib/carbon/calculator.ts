// ===========================================
// Carbon Calculator Engine — ECO MIND AI
// ===========================================

import { EMISSION_FACTORS, NATIONAL_AVERAGE_MONTHLY_KG } from './factors';
import type { UserPreferences } from '@/types/user';
import type { CarbonBreakdown } from '@/types/carbon';

/**
 * Calculate monthly carbon emissions from user preferences.
 * All values returned in kg CO₂/month.
 */
export function calculateMonthlyEmissions(preferences: UserPreferences): CarbonBreakdown {
  return {
    transport: calculateTransportEmissions(preferences),
    food: calculateFoodEmissions(preferences),
    energy: calculateEnergyEmissions(preferences),
    shopping: calculateShoppingEmissions(preferences),
    waste: calculateWasteEmissions(preferences),
  };
}

export function calculateTotalEmissions(breakdown: CarbonBreakdown): number {
  return Object.values(breakdown).reduce((sum, val) => sum + val, 0);
}

// ------------------------------------------
// Transport: sum of all modes × daily km × 30 days
// ------------------------------------------
function calculateTransportEmissions(prefs: UserPreferences): number {
  const { primaryModes, dailyCommuteKm, monthlyFlights } = prefs.transport;
  let total = 0;

  if (primaryModes.length > 0 && dailyCommuteKm > 0) {
    // Split commute distance equally among modes
    const kmPerMode = dailyCommuteKm / primaryModes.length;

    for (const mode of primaryModes) {
      const factorEntry = EMISSION_FACTORS.transport[mode as keyof typeof EMISSION_FACTORS.transport];
      if (factorEntry) {
        total += factorEntry.factor * kmPerMode * 30; // 30 days/month
      }
    }
  }

  // Flights: assume average 800km domestic flight
  if (monthlyFlights > 0) {
    total += EMISSION_FACTORS.transport.flight_domestic.factor * 800 * monthlyFlights;
  }

  return Math.round(total * 100) / 100;
}

// ------------------------------------------
// Food: daily factor × 30 days
// ------------------------------------------
function calculateFoodEmissions(prefs: UserPreferences): number {
  const dietType = prefs.food.dietType;
  const factorEntry = EMISSION_FACTORS.food[dietType as keyof typeof EMISSION_FACTORS.food];
  if (!factorEntry) return 0;
  return Math.round(factorEntry.factor * 30 * 100) / 100;
}

// ------------------------------------------
// Energy: electricity + AC + water
// ------------------------------------------
function calculateEnergyEmissions(prefs: UserPreferences): number {
  const { electricityUnitsPerMonth, acHoursPerDay, waterConsumptionLiters } = prefs.energy;
  let total = 0;

  // Electricity: units (kWh) × emission factor
  total += electricityUnitsPerMonth * EMISSION_FACTORS.energy.electricity.factor;

  // AC: hours/day × 30 days × emission factor per hour
  total += acHoursPerDay * 30 * EMISSION_FACTORS.energy.ac_hourly.factor;

  // Water: liters/day × 30 days / 1000 × factor per 1000L
  total += (waterConsumptionLiters * 30 / 1000) * EMISSION_FACTORS.energy.water_per_1000l.factor;

  return Math.round(total * 100) / 100;
}

// ------------------------------------------
// Shopping: online orders + fast fashion
// ------------------------------------------
function calculateShoppingEmissions(prefs: UserPreferences): number {
  let total = 0;
  total += prefs.shopping.onlineOrdersPerMonth * EMISSION_FACTORS.shopping.online_order.factor;
  total += prefs.shopping.fastFashionItemsPerMonth * EMISSION_FACTORS.shopping.fast_fashion.factor;
  return Math.round(total * 100) / 100;
}

// ------------------------------------------
// Waste: recycling level × 30 days
// ------------------------------------------
function calculateWasteEmissions(prefs: UserPreferences): number {
  const level = prefs.waste.recyclingLevel;
  const composting = prefs.waste.composting;

  let factorKey: keyof typeof EMISSION_FACTORS.waste = 'none';
  if (level === 'full' && composting) {
    factorKey = 'full';
  } else if (level === 'partial' || (level === 'full' && !composting)) {
    factorKey = 'partial';
  }

  return Math.round(EMISSION_FACTORS.waste[factorKey].factor * 30 * 100) / 100;
}

/**
 * Calculate carbon emission for a single activity entry.
 */
export function calculateActivityEmission(
  category: string,
  activityType: string,
  value: number
): number {
  switch (category) {
    case 'transport': {
      const factor = EMISSION_FACTORS.transport[activityType as keyof typeof EMISSION_FACTORS.transport];
      return factor ? Math.round(factor.factor * value * 100) / 100 : 0;
    }
    case 'food': {
      const factor = EMISSION_FACTORS.food[activityType as keyof typeof EMISSION_FACTORS.food];
      return factor ? Math.round(factor.factor * value * 100) / 100 : 0;
    }
    case 'energy': {
      if (activityType === 'electricity') {
        return Math.round(EMISSION_FACTORS.energy.electricity.factor * value * 100) / 100;
      }
      if (activityType === 'ac') {
        return Math.round(EMISSION_FACTORS.energy.ac_hourly.factor * value * 100) / 100;
      }
      return 0;
    }
    case 'shopping': {
      const factor = EMISSION_FACTORS.shopping[activityType as keyof typeof EMISSION_FACTORS.shopping];
      return factor ? Math.round(factor.factor * value * 100) / 100 : 0;
    }
    default:
      return 0;
  }
}

/**
 * Compare user emissions to national average.
 * Returns percentage above or below average.
 */
export function compareToAverage(monthlyEmission: number): {
  percentageDiff: number;
  isAboveAverage: boolean;
  message: string;
} {
  const diff = monthlyEmission - NATIONAL_AVERAGE_MONTHLY_KG;
  const percentageDiff = Math.round((diff / NATIONAL_AVERAGE_MONTHLY_KG) * 100);

  return {
    percentageDiff: Math.abs(percentageDiff),
    isAboveAverage: diff > 0,
    message: diff > 0
      ? `${Math.abs(percentageDiff)}% above India's average`
      : `${Math.abs(percentageDiff)}% below India's average`,
  };
}
