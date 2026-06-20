// ===========================================
// Gemini Client Fetcher Helper — ECO MIND AI
// ===========================================

const FALLBACKS: Record<string, any> = {
  coach: [
    {
      id: "fallback-rec-1",
      content: "Switch to LED light bulbs in your home to reduce electricity consumption by up to 80%.",
      category: "energy",
      potentialSavingKg: 15
    },
    {
      id: "fallback-rec-2",
      content: "Consolidate online deliveries to reduce shipping and packaging carbon emissions.",
      category: "shopping",
      potentialSavingKg: 10
    },
    {
      id: "fallback-rec-3",
      content: "Try adopting a Meatless Monday routine to reduce your dietary footprint.",
      category: "food",
      potentialSavingKg: 25
    }
  ],
  challenges: [
    {
      title: "Reduce AC usage by 1 hour daily",
      description: "Setting your air conditioner temperature 1-2 degrees higher or using it 1 hour less per day saves considerable grid power.",
      targetCO2Savings: 28,
      difficulty: "easy",
      rewardPoints: 50
    },
    {
      title: "Public transit commuting challenge",
      description: "Shift 2 of your daily commutes this week from a personal vehicle to the metro or public bus.",
      targetCO2Savings: 15,
      difficulty: "medium",
      rewardPoints: 100
    },
    {
      title: "Zero Fast-Fashion Month",
      description: "Avoid buying new fast-fashion clothing items this week to reduce manufacturing water and carbon footprint.",
      targetCO2Savings: 10,
      difficulty: "medium",
      rewardPoints: 100
    }
  ],
  learn: [
    {
      topic: "Transitioning to Solar Power in India",
      reason: "Learn about state incentives, grid-metering, and reducing AC emissions.",
      pointsReward: 25,
    },
    {
      topic: "Maximizing Public Transit Commutes",
      reason: "Discover carbon-saving ratios of shifting from car travel to metros or buses.",
      pointsReward: 15,
    },
    {
      topic: "Methane and Dairy footprint",
      reason: "A structured review of diet-linked agricultural emissions.",
      pointsReward: 20,
    }
  ],
  tracker: [
    {
      category: "transport",
      description: "Logged transport activity (AI offline fallback)",
      parsedData: { mode: "car", distanceKm: 10 },
      estimatedCarbonKg: 2.1,
      confidence: 0.5
    }
  ],
  bill: {
    provider: "Utility Provider (AI offline)",
    unitsConsumed: 120,
    billingAmount: 980,
    billingPeriod: "Current Period",
    carbonImpact: 98.4
  },
  receipt: {
    items: [
      { name: "Eco Friendly Grocery Items", impactRating: "low", estimatedCarbonKg: 1.5 },
      { name: "Packaged Goods", impactRating: "medium", estimatedCarbonKg: 3.2 }
    ],
    recommendation: "AI offline. Try to buy local produce in bulk and avoid plastic packaging."
  },
  journal: {
    co2SavedKg: 4.2,
    scoreIncrease: 15,
    encouragement: "Amazing day! You saved approximately 4.2 kg CO₂ compared to the average Indian lifestyle. Your consistent green choices are making a real difference. (AI offline fallback)",
    activities: [
      "🚲 Commuted by bicycle or walking",
      "🥗 Ate eco-friendly vegetarian meals",
      "♻️ Segregated and composted waste"
    ]
  }
};

/**
 * Call the server-side Gemini API proxy route.
 */
export async function callGemini(type: string, payload: any): Promise<any> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, payload }),
    });

    if (!res.ok) {
      const errorJson = await res.json();
      throw new Error(errorJson.error || `Server returned status ${res.status}`);
    }

    const json = await res.json();
    
    if (json.error) {
      throw new Error(json.error);
    }

    const data = json.data;
    if (data && typeof data === 'object') {
      data.isFallback = false;
    }
    return data;
  } catch (e: any) {
    console.error(`Gemini integration error on type [${type}], using fallback:`, e);
    const fallback = FALLBACKS[type] || {};
    if (fallback && typeof fallback === 'object') {
      fallback.isFallback = true;
    }
    return fallback;
  }
}

