'use client';

// ===========================================
// Carbon Impact Simulator — ECO MIND AI
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Car, Zap, Utensils, ShoppingBag, Trash2,
  TreePine, TrendingDown, Info, RefreshCw, AlertCircle,
  HelpCircle, CheckCircle2, Navigation2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { calculateMonthlyEmissions, calculateTotalEmissions } from '@/lib/carbon/calculator';
import { EMISSION_FACTORS, KG_CO2_PER_TREE_PER_YEAR } from '@/lib/carbon/factors';
import { formatCO2, formatNumber } from '@/lib/utils/formatters';
import type { UserPreferences, TransportMode } from '@/types/user';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#22c55e',
  shopping: '#8b5cf6',
  waste: '#ef4444',
};

export default function SimulatorPage() {
  const { user } = useAuth();
  
  // Set up local state for preferences, initialized with user defaults or global defaults
  const [transportModes, setTransportModes] = useState<TransportMode[]>(['car']);
  const [dailyCommute, setDailyCommute] = useState<number>(15);
  const [monthlyFlights, setMonthlyFlights] = useState<number>(0);
  
  const [electricity, setElectricity] = useState<number>(200);
  const [acHours, setAcHours] = useState<number>(3);
  const [water, setWater] = useState<number>(150);
  
  const [diet, setDiet] = useState<string>('mixed');
  
  const [shoppingOrders, setShoppingOrders] = useState<number>(4);
  const [fastFashion, setFastFashion] = useState<number>(1);
  
  const [recycling, setRecycling] = useState<string>('partial');
  const [composting, setComposting] = useState<boolean>(false);

  // Initialize from user preferences if available
  useEffect(() => {
    if (user?.preferences) {
      const prefs = user.preferences;
      setTransportModes(prefs.transport.primaryModes || ['car']);
      setDailyCommute(prefs.transport.dailyCommuteKm || 15);
      setMonthlyFlights(prefs.transport.monthlyFlights || 0);
      setElectricity(prefs.energy.electricityUnitsPerMonth || 200);
      setAcHours(prefs.energy.acHoursPerDay || 3);
      setWater(prefs.energy.waterConsumptionLiters || 150);
      setDiet(prefs.food.dietType || 'mixed');
      setShoppingOrders(prefs.shopping.onlineOrdersPerMonth || 4);
      setFastFashion(prefs.shopping.fastFashionItemsPerMonth || 1);
      setRecycling(prefs.waste.recyclingLevel || 'partial');
      setComposting(prefs.waste.composting || false);
    }
  }, [user]);

  // Construct preferences object from current simulation state
  const simulatedPrefs: UserPreferences = {
    transport: {
      primaryModes: transportModes,
      dailyCommuteKm: dailyCommute,
      monthlyFlights: monthlyFlights,
    },
    energy: {
      electricityUnitsPerMonth: electricity,
      acHoursPerDay: acHours,
      waterConsumptionLiters: water,
    },
    food: {
      dietType: diet as any,
    },
    shopping: {
      onlineOrdersPerMonth: shoppingOrders,
      fastFashionItemsPerMonth: fastFashion,
    },
    waste: {
      recyclingLevel: recycling as any,
      composting: composting,
    },
  };

  // Run emissions engine on current sliders state
  const simulatedBreakdown = calculateMonthlyEmissions(simulatedPrefs);
  const simulatedTotal = calculateTotalEmissions(simulatedBreakdown);
  const simulatedYearly = simulatedTotal * 12;
  const simulatedTrees = Math.ceil(simulatedYearly / KG_CO2_PER_TREE_PER_YEAR);

  // Compare against baseline (user's actual profile)
  const baselinePrefs = user?.preferences || simulatedPrefs;
  const baselineBreakdown = calculateMonthlyEmissions(baselinePrefs);
  const baselineTotal = calculateTotalEmissions(baselineBreakdown);
  const savings = baselineTotal - simulatedTotal;
  const savingsPercent = baselineTotal > 0 ? (savings / baselineTotal) * 100 : 0;

  // India & Global Averages
  const nationalAvgMonthly = 150; // kg CO2
  
  // AI Dynamic Coaching recommendations based on simulated output
  const getSimulatedCoachMessage = () => {
    if (savings > 50) {
      return {
        title: '🌱 Exceptional Green Plan!',
        desc: `By making these changes, you save ${formatCO2(savings)} monthly (${savingsPercent.toFixed(0)}% reduction). This layout requires ${simulatedTrees} trees/year to absorb, down from ${Math.ceil((baselineTotal * 12) / KG_CO2_PER_TREE_PER_YEAR)}. Outstanding!`,
        type: 'success',
      };
    }
    
    // Find highest emission source in simulation
    const maxVal = Math.max(...Object.values(simulatedBreakdown));
    const highestCategory = Object.keys(simulatedBreakdown).find(
      key => simulatedBreakdown[key as keyof typeof simulatedBreakdown] === maxVal
    );

    if (highestCategory === 'transport') {
      return {
        title: '🚗 Transport Dominates footprint',
        desc: 'Your transport emissions represent a significant chunk of your profile. Consider checking "metro" or "bus" in transport modes and shifting commute sharing.',
        type: 'warning',
      };
    }
    if (highestCategory === 'energy') {
      return {
        title: '⚡ Electricity and AC impact',
        desc: 'Electricity grid in India is coal-heavy (0.82 kg/kWh). Try lowering AC cooling hours or adjusting the baseline thermostat to 26°C.',
        type: 'warning',
      };
    }
    if (highestCategory === 'food') {
      return {
        title: '🥩 Food emissions highlight',
        desc: 'Switching diet slider to Vegetarian or Vegan cuts food emissions by up to 50% immediately, as cattle and animal farming are highly carbon-intensive.',
        type: 'warning',
      };
    }
    if (highestCategory === 'shopping') {
      return {
        title: '🛍️ Deliveries & Fast Fashion impact',
        desc: 'Fast fashion carries a heavy 10kg CO₂ per item footprint. Reducing garments monthly and consolidating online orders can bring this down.',
        type: 'warning',
      };
    }
    
    return {
      title: '💡 Small shifts build giant impacts',
      desc: 'Adjust the sliders to simulate a greener lifestyle. Check how toggling full recycling & composting affects waste impact.',
      type: 'info',
    };
  };

  const coachMessage = getSimulatedCoachMessage();

  const resetToBaseline = () => {
    if (user?.preferences) {
      const prefs = user.preferences;
      setTransportModes(prefs.transport.primaryModes || ['car']);
      setDailyCommute(prefs.transport.dailyCommuteKm || 15);
      setMonthlyFlights(prefs.transport.monthlyFlights || 0);
      setElectricity(prefs.energy.electricityUnitsPerMonth || 200);
      setAcHours(prefs.energy.acHoursPerDay || 3);
      setWater(prefs.energy.waterConsumptionLiters || 150);
      setDiet(prefs.food.dietType || 'mixed');
      setShoppingOrders(prefs.shopping.onlineOrdersPerMonth || 4);
      setFastFashion(prefs.shopping.fastFashionItemsPerMonth || 1);
      setRecycling(prefs.waste.recyclingLevel || 'partial');
      setComposting(prefs.waste.composting || false);
    }
  };

  const handleModeToggle = (mode: TransportMode) => {
    if (transportModes.includes(mode)) {
      if (transportModes.length > 1) {
        setTransportModes(transportModes.filter(m => m !== mode));
      }
    } else {
      setTransportModes([...transportModes, mode]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-display)] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-eco-400" />
            Carbon Impact <span className="text-gradient-eco">Simulator</span>
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            Simulate how changes to your daily lifestyle influence your personal carbon footprint.
          </p>
        </div>
        <button
          onClick={resetToBaseline}
          className="flex items-center gap-1.5 self-start sm:self-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4 text-surface-400" />
          Reset to Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Sliders & Form Controls (8 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Transport Section */}
          <div className="glass-card-static p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Car className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Transport Emissions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-surface-400 block mb-2">Primary Commute Modes (Select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'car', label: 'Car 🚗' },
                    { id: 'motorcycle', label: 'Motorcycle 🏍️' },
                    { id: 'bus', label: 'Bus 🚌' },
                    { id: 'metro', label: 'Metro 🚇' },
                    { id: 'train', label: 'Train 🚆' },
                    { id: 'bicycle', label: 'Bicycle 🚲' },
                    { id: 'walking', label: 'Walk 🚶' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleModeToggle(m.id as TransportMode)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        transportModes.includes(m.id as TransportMode)
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-white/3 text-surface-400 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-400">Daily Commute Distance</span>
                  <span className="text-sm font-semibold text-white">{dailyCommute} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={dailyCommute}
                  onChange={(e) => setDailyCommute(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-400">Monthly Flights (Domestic, ~800km each)</span>
                  <span className="text-sm font-semibold text-white">{monthlyFlights} flights</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={monthlyFlights}
                  onChange={(e) => setMonthlyFlights(parseInt(e.target.value))}
                  className="w-full accent-blue-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Energy Section */}
          <div className="glass-card-static p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">Energy Consumption</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-400">Electricity Units (kWh / month)</span>
                  <span className="text-sm font-semibold text-white">{electricity} Units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="25"
                  value={electricity}
                  onChange={(e) => setElectricity(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <p className="text-[10px] text-surface-500 mt-1">India national average is ~150-250 units/month for households.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-400">AC Usage (hours / day)</span>
                  <span className="text-sm font-semibold text-white">{acHours} hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={acHours}
                  onChange={(e) => setAcHours(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-surface-400">Water Consumption (liters / day / person)</span>
                  <span className="text-sm font-semibold text-white">{water} Liters</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="350"
                  step="10"
                  value={water}
                  onChange={(e) => setWater(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Food Diet Section */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Utensils className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">Food & Diet</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'non-vegetarian', label: 'High Meat 🥩', desc: 'Frequent meat meals' },
                { id: 'mixed', label: 'Mixed 🍳', desc: 'Moderate poultry/fish' },
                { id: 'vegetarian', label: 'Vegetarian 🥛', desc: 'Dairy, no meat' },
                { id: 'vegan', label: 'Vegan 🌿', desc: 'Strict plant-based' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDiet(d.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    diet === d.id
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 scale-[1.02]'
                      : 'bg-white/3 text-surface-400 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm font-bold block mb-1">{d.label}</span>
                  <span className="text-[10px] text-surface-500 leading-tight">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shopping & Waste Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Shopping */}
            <div className="glass-card-static p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Online Deliveries</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-surface-400">Monthly Orders</span>
                    <span className="text-xs font-semibold text-white">{shoppingOrders} orders</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={shoppingOrders}
                    onChange={(e) => setShoppingOrders(parseInt(e.target.value))}
                    className="w-full accent-purple-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-surface-400">Fast Fashion Items</span>
                    <span className="text-xs font-semibold text-white">{fastFashion} items</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={fastFashion}
                    onChange={(e) => setFastFashion(parseInt(e.target.value))}
                    className="w-full accent-purple-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Waste */}
            <div className="glass-card-static p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Waste & Recycling</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-surface-400 block mb-1">Recycling Level</label>
                  <select
                    value={recycling}
                    onChange={(e) => setRecycling(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-eco-500"
                  >
                    <option value="none" className="bg-surface-900 text-white">No recycling (Throw everything)</option>
                    <option value="partial" className="bg-surface-900 text-white">Partial (Separate papers/plastics)</option>
                    <option value="full" className="bg-surface-900 text-white">Full (Consistently recycle all)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-white font-medium block">Composting</span>
                    <span className="text-[10px] text-surface-500">Compost kitchen/food waste</span>
                  </div>
                  <button
                    onClick={() => setComposting(!composting)}
                    className={`w-10 h-6 rounded-full p-1 transition-all ${
                      composting ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        composting ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Side: Results & AI Assistant (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Carbon Output Dashboard Card */}
          <div className="glass-card-static p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-eco-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="text-center">
              <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">Simulated Emissions</h2>
              <div className="mt-3 flex justify-center items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight font-[var(--font-display)]">
                  {formatCO2(simulatedTotal)}
                </span>
                <span className="text-xs text-surface-400">/ month</span>
              </div>
              <p className="text-xs text-surface-500 mt-1">
                Annual Total: {formatCO2(simulatedYearly)}
              </p>
            </div>

            {/* Baseline comparison */}
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-400">Your Current Baseline:</span>
                <span className="text-white font-medium">{formatCO2(baselineTotal)}/mo</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Simulation Change:</span>
                {savings === 0 ? (
                  <span className="text-xs text-surface-400 font-semibold">No Change</span>
                ) : savings > 0 ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    -{formatCO2(savings)} (-{savingsPercent.toFixed(0)}%)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                    +{formatCO2(Math.abs(savings))} (+{Math.abs(savingsPercent).toFixed(0)}%)
                  </span>
                )}
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    simulatedTotal <= baselineTotal ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (simulatedTotal / baselineTotal) * 100)}%` }}
                />
              </div>
            </div>

            {/* National Average comparison */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-400">India National Average:</span>
                <span className="text-surface-300 font-medium">{nationalAvgMonthly} kg/mo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-400">Status vs National Avg:</span>
                {simulatedTotal <= nationalAvgMonthly ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {((1 - simulatedTotal / nationalAvgMonthly) * 100).toFixed(0)}% Lower 🌿
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {((simulatedTotal / nationalAvgMonthly - 1) * 100).toFixed(0)}% Higher ⚠️
                  </span>
                )}
              </div>
            </div>

            {/* Trees Offset Card */}
            <div className="p-4 rounded-2xl bg-eco-500/10 border border-eco-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-eco flex items-center justify-center shrink-0">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                  {simulatedTrees} Trees / year
                </p>
                <p className="text-xs text-surface-400 leading-normal">
                  Required to offset your simulated footprint (tropical India absorption rates).
                </p>
              </div>
            </div>

          </div>

          {/* AI Coach Suggestion Card */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-eco-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-white">Gemini Coach Assessment</h3>
              </div>
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Simulated live</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">{coachMessage.title}</h4>
              <p className="text-xs text-surface-400 leading-relaxed">{coachMessage.desc}</p>
            </div>

            <div className="pt-2 border-t border-white/5 flex gap-2">
              <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-surface-400">
                Co₂ factors: CEA/EPA 2024
              </span>
              <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-surface-400">
                Region: India
              </span>
            </div>
          </div>

          {/* Educational Quick Box */}
          <div className="p-5 rounded-2xl bg-white/3 border border-white/5 text-xs text-surface-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Did you know?
            </div>
            <p className="leading-relaxed">
              Every 1 kWh of electricity in India produces ~0.82 kg of CO₂ due to our heavy reliance on coal power plants. By comparison, in countries with high renewable energy profiles, this factor is below 0.2 kg. Small shifts in home AC hours translate into giant reductions in carbon.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
