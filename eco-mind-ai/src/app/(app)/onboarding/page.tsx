'use client';

// ===========================================
// Smart Onboarding — ECO MIND AI
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ONBOARDING_STEPS, TRANSPORT_MODES } from '@/lib/utils/constants';
import { calculateMonthlyEmissions, calculateTotalEmissions } from '@/lib/carbon/calculator';
import { calculateCarbonScore, getCarbonCategory } from '@/lib/carbon/scoring';
import type { UserPreferences, TransportMode, FoodHabit, RecyclingLevel } from '@/types/user';

export default function OnboardingPage() {
  const { updateUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferences>({
    transport: { primaryModes: [], dailyCommuteKm: 10, monthlyFlights: 0 },
    energy: { electricityUnitsPerMonth: 200, acHoursPerDay: 2, waterConsumptionLiters: 100 },
    food: { dietType: 'mixed' },
    shopping: { onlineOrdersPerMonth: 3, fastFashionItemsPerMonth: 0 },
    waste: { recyclingLevel: 'partial', composting: false },
  });

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStep = ONBOARDING_STEPS[step];
  const progress = ((step + 1) / totalSteps) * 100;

  const handleComplete = () => {
    const breakdown = calculateMonthlyEmissions(prefs);
    const total = calculateTotalEmissions(breakdown);
    const score = calculateCarbonScore(total);
    updateUser({
      preferences: prefs,
      carbonScore: score,
      carbonCategory: getCarbonCategory(score),
      onboardingComplete: true,
    });
    router.push('/dashboard');
  };

  const toggleTransportMode = (mode: TransportMode) => {
    setPrefs(p => ({
      ...p,
      transport: {
        ...p.transport,
        primaryModes: p.transport.primaryModes.includes(mode)
          ? p.transport.primaryModes.filter(m => m !== mode)
          : [...p.transport.primaryModes, mode],
      },
    }));
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (step < totalSteps - 1) { setDirection(1); setStep(s => s + 1); }
    else handleComplete();
  };
  const goBack = () => { if (step > 0) { setDirection(-1); setStep(s => s - 1); } };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-eco mx-auto mb-4 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Let&apos;s Calculate Your Footprint
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            Step {step + 1} of {totalSteps}: {currentStep.title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {ONBOARDING_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'gradient-eco text-white' :
                  i === step ? 'bg-eco-500/20 text-eco-400 border-2 border-eco-500' :
                  'bg-white/5 text-surface-500 border border-white/10'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : s.icon}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-1 ${
                    i < step ? 'bg-eco-500' : 'bg-white/5'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full gradient-eco rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card-static p-8 min-h-[380px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            >
              {/* Transport Step */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">🚗 How do you travel?</h2>
                  <p className="text-sm text-surface-400 mb-6">Select your primary modes of transportation</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {TRANSPORT_MODES.map((mode) => {
                      const selected = prefs.transport.primaryModes.includes(mode.id as TransportMode);
                      return (
                        <button
                          key={mode.id}
                          onClick={() => toggleTransportMode(mode.id as TransportMode)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selected
                              ? 'bg-eco-500/15 border-eco-500/30 text-white'
                              : 'bg-white/3 border-white/5 text-surface-400 hover:border-white/15'
                          }`}
                          aria-pressed={selected}
                        >
                          <div className="text-2xl mb-1">{mode.icon}</div>
                          <p className="text-xs font-medium">{mode.label}</p>
                          <p className="text-[10px] text-surface-500 mt-0.5">{mode.emission}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="commute-km">Daily commute distance (km)</label>
                      <input
                        id="commute-km" type="range" min="0" max="100" step="1"
                        value={prefs.transport.dailyCommuteKm}
                        onChange={e => setPrefs(p => ({ ...p, transport: { ...p.transport, dailyCommuteKm: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>0 km</span>
                        <span className="text-eco-400 font-semibold">{prefs.transport.dailyCommuteKm} km</span>
                        <span>100 km</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="flights">Monthly flights</label>
                      <input
                        id="flights" type="number" min="0" max="20"
                        value={prefs.transport.monthlyFlights}
                        onChange={e => setPrefs(p => ({ ...p, transport: { ...p.transport, monthlyFlights: +e.target.value } }))}
                        className="w-full glass-input px-4 py-2.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Energy Step */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">⚡ Home Energy Usage</h2>
                  <p className="text-sm text-surface-400 mb-6">Tell us about your energy consumption</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="electricity">Electricity units/month (kWh)</label>
                      <input
                        id="electricity" type="range" min="50" max="1000" step="10"
                        value={prefs.energy.electricityUnitsPerMonth}
                        onChange={e => setPrefs(p => ({ ...p, energy: { ...p.energy, electricityUnitsPerMonth: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>50</span>
                        <span className="text-eco-400 font-semibold">{prefs.energy.electricityUnitsPerMonth} kWh</span>
                        <span>1000</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="ac-hours">AC usage (hours/day)</label>
                      <input
                        id="ac-hours" type="range" min="0" max="24" step="0.5"
                        value={prefs.energy.acHoursPerDay}
                        onChange={e => setPrefs(p => ({ ...p, energy: { ...p.energy, acHoursPerDay: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>0h</span>
                        <span className="text-eco-400 font-semibold">{prefs.energy.acHoursPerDay}h/day</span>
                        <span>24h</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="water">Water consumption (liters/day)</label>
                      <input
                        id="water" type="range" min="20" max="500" step="10"
                        value={prefs.energy.waterConsumptionLiters}
                        onChange={e => setPrefs(p => ({ ...p, energy: { ...p.energy, waterConsumptionLiters: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>20L</span>
                        <span className="text-eco-400 font-semibold">{prefs.energy.waterConsumptionLiters}L</span>
                        <span>500L</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Food Step */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">🍽️ Food Habits</h2>
                  <p className="text-sm text-surface-400 mb-6">What best describes your diet?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'vegan', label: 'Vegan', icon: '🌱', desc: '2.89 kg CO₂/day', color: '#22c55e' },
                      { id: 'vegetarian', label: 'Vegetarian', icon: '🥗', desc: '3.81 kg CO₂/day', color: '#4ade80' },
                      { id: 'mixed', label: 'Mixed', icon: '🍳', desc: '5.63 kg CO₂/day', color: '#f59e0b' },
                      { id: 'non-vegetarian', label: 'Non-Vegetarian', icon: '🥩', desc: '7.19 kg CO₂/day', color: '#ef4444' },
                    ] as const).map((diet) => {
                      const selected = prefs.food.dietType === diet.id;
                      return (
                        <button
                          key={diet.id}
                          onClick={() => setPrefs(p => ({ ...p, food: { dietType: diet.id as FoodHabit } }))}
                          className={`p-5 rounded-xl border text-center transition-all ${
                            selected ? 'border-eco-500/30 bg-eco-500/10' : 'border-white/5 bg-white/3 hover:border-white/15'
                          }`}
                          aria-pressed={selected}
                        >
                          <div className="text-3xl mb-2">{diet.icon}</div>
                          <p className="text-sm font-medium text-white">{diet.label}</p>
                          <p className="text-[10px] mt-1" style={{ color: diet.color }}>{diet.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shopping Step */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">🛒 Shopping Habits</h2>
                  <p className="text-sm text-surface-400 mb-6">Your online and fashion shopping patterns</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="online-orders">Online orders per month</label>
                      <input
                        id="online-orders" type="range" min="0" max="30" step="1"
                        value={prefs.shopping.onlineOrdersPerMonth}
                        onChange={e => setPrefs(p => ({ ...p, shopping: { ...p.shopping, onlineOrdersPerMonth: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>0</span>
                        <span className="text-eco-400 font-semibold">{prefs.shopping.onlineOrdersPerMonth} orders</span>
                        <span>30</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-surface-300 mb-2" htmlFor="fast-fashion">Fast fashion items per month</label>
                      <input
                        id="fast-fashion" type="range" min="0" max="10" step="1"
                        value={prefs.shopping.fastFashionItemsPerMonth}
                        onChange={e => setPrefs(p => ({ ...p, shopping: { ...p.shopping, fastFashionItemsPerMonth: +e.target.value } }))}
                        className="w-full accent-eco-500"
                      />
                      <div className="flex justify-between text-xs text-surface-500 mt-1">
                        <span>0</span>
                        <span className="text-eco-400 font-semibold">{prefs.shopping.fastFashionItemsPerMonth} items</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Waste Step */}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">♻️ Waste Management</h2>
                  <p className="text-sm text-surface-400 mb-6">How do you handle waste?</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-surface-300 mb-3">Recycling habits</p>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { id: 'none', label: 'No Recycling', icon: '🗑️' },
                          { id: 'partial', label: 'Some Recycling', icon: '♻️' },
                          { id: 'full', label: 'Full Recycling', icon: '🌿' },
                        ] as const).map((level) => {
                          const selected = prefs.waste.recyclingLevel === level.id;
                          return (
                            <button
                              key={level.id}
                              onClick={() => setPrefs(p => ({ ...p, waste: { ...p.waste, recyclingLevel: level.id as RecyclingLevel } }))}
                              className={`p-4 rounded-xl border text-center transition-all ${
                                selected ? 'border-eco-500/30 bg-eco-500/10' : 'border-white/5 bg-white/3 hover:border-white/15'
                              }`}
                              aria-pressed={selected}
                            >
                              <div className="text-2xl mb-1">{level.icon}</div>
                              <p className="text-xs font-medium text-white">{level.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
                      <input
                        type="checkbox" id="composting"
                        checked={prefs.waste.composting}
                        onChange={e => setPrefs(p => ({ ...p, waste: { ...p.waste, composting: e.target.checked } }))}
                        className="w-4 h-4 accent-eco-500 rounded"
                      />
                      <label htmlFor="composting" className="text-sm text-surface-300">I compost food waste</label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-xl hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl hover:shadow-lg hover:shadow-eco-500/20 transition-all"
          >
            {step === totalSteps - 1 ? 'Calculate My Footprint' : 'Next'}
            {step === totalSteps - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
