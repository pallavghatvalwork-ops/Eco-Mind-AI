// ===========================================
// Carbon Emission Factors — India-Specific (EPA/IPCC)
// ===========================================
// Region-configurable architecture: swap this file
// for different regions or load from Firestore

export const EMISSION_FACTORS = {
  transport: {
    car: { factor: 0.21, unit: 'kg CO₂/km', description: 'Average petrol car' },
    motorcycle: { factor: 0.10, unit: 'kg CO₂/km', description: 'Average motorcycle' },
    bus: { factor: 0.089, unit: 'kg CO₂/km', description: 'Public bus per passenger' },
    train: { factor: 0.041, unit: 'kg CO₂/km', description: 'Indian Railways average' },
    metro: { factor: 0.033, unit: 'kg CO₂/km', description: 'Metro rail per passenger' },
    flight_domestic: { factor: 0.255, unit: 'kg CO₂/km', description: 'Domestic flight' },
    flight_international: { factor: 0.195, unit: 'kg CO₂/km', description: 'International flight' },
    walking: { factor: 0, unit: 'kg CO₂/km', description: 'Walking' },
    bicycle: { factor: 0, unit: 'kg CO₂/km', description: 'Cycling' },
    flight: { factor: 0.255, unit: 'kg CO₂/km', description: 'Average flight' },
  },

  energy: {
    electricity: { factor: 0.82, unit: 'kg CO₂/kWh', description: 'India grid average (CEA 2023)' },
    ac_hourly: { factor: 1.23, unit: 'kg CO₂/hour', description: '1.5 ton AC @ 1.5 kWh/hr × 0.82' },
    water_per_1000l: { factor: 0.344, unit: 'kg CO₂/1000L', description: 'Water treatment & pumping' },
  },

  food: {
    'non-vegetarian': { factor: 7.19, unit: 'kg CO₂/day', description: 'Meat-heavy diet' },
    mixed: { factor: 5.63, unit: 'kg CO₂/day', description: 'Mixed diet' },
    vegetarian: { factor: 3.81, unit: 'kg CO₂/day', description: 'Vegetarian diet' },
    vegan: { factor: 2.89, unit: 'kg CO₂/day', description: 'Vegan diet' },
  },

  shopping: {
    online_order: { factor: 1.5, unit: 'kg CO₂/order', description: 'Packaging + delivery' },
    fast_fashion: { factor: 10, unit: 'kg CO₂/item', description: 'Fast fashion garment' },
  },

  waste: {
    none: { factor: 2.1, unit: 'kg CO₂/day', description: 'No recycling' },
    partial: { factor: 1.2, unit: 'kg CO₂/day', description: 'Partial recycling' },
    full: { factor: 0.5, unit: 'kg CO₂/day', description: 'Full recycling + composting' },
  },
} as const;

// India national average: ~1.8 tonnes CO₂/person/year ≈ 150 kg/month
export const NATIONAL_AVERAGE_MONTHLY_KG = 150;
export const NATIONAL_AVERAGE_YEARLY_KG = 1800;
export const GLOBAL_AVERAGE_YEARLY_KG = 4700;

// Trees needed to offset: 1 tree absorbs ~22 kg CO₂/year (tropical India estimate)
export const KG_CO2_PER_TREE_PER_YEAR = 22;

// Car equivalent: average car emits 0.21 kg CO₂/km
export const KG_CO2_PER_KM_CAR = 0.21;
