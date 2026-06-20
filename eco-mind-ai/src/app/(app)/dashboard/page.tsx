'use client';

// ===========================================
// Dashboard Page — ECO MIND AI
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, TrendingDown, Flame, Target, Lightbulb,
  ArrowUpRight, ArrowDownRight, Zap, TreePine, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CarbonScoreRing from '@/components/charts/CarbonScoreRing';
import EmissionPieChart from '@/components/charts/EmissionPieChart';
import TrendLineChart from '@/components/charts/TrendLineChart';
import {
  MOCK_CARBON_REPORTS, MOCK_CHALLENGES, MOCK_RECOMMENDATIONS,
} from '@/lib/mock-data';
import { calculateMonthlyEmissions, calculateTotalEmissions } from '@/lib/carbon/calculator';
import { getCarbonCategoryDetails } from '@/lib/carbon/scoring';
import { formatCO2, formatNumber } from '@/lib/utils/formatters';
import {
  KG_CO2_PER_TREE_PER_YEAR, KG_CO2_PER_KM_CAR,
} from '@/lib/carbon/factors';
import { callGemini } from '@/lib/utils/gemini';
import { Recommendation } from '@/types/challenge';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [errorRecs, setErrorRecs] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!user?.preferences) return;
      setLoadingRecs(true);
      setErrorRecs(null);
      try {
        const data = await callGemini('coach', {
          preferences: user.preferences,
          carbonScore: user.carbonScore,
        });
        if (data && Array.isArray(data)) {
          const formatted = data.map((rec: any, idx: number) => ({
            id: rec.id || `rec-gemini-${idx}`,
            userId: user.uid,
            content: rec.content,
            category: rec.category,
            potentialSavingKg: rec.potentialSavingKg,
            dismissed: false,
            generatedAt: new Date().toISOString(),
          }));
          setRecommendations(formatted);
        }
      } catch (err: any) {
        console.error('Failed to load Sustainability Coach recommendations from Gemini API:', err);
        setErrorRecs(err.message || 'Failed to generate recommendations. Using offline suggestions.');
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchRecommendations();
  }, [user?.preferences, user?.carbonScore, user?.uid]);

  if (!user?.preferences) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card-static p-10 text-center max-w-md">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-xl font-bold text-white mb-2">Complete Onboarding First</h2>
          <p className="text-surface-400 mb-6">Tell us about your lifestyle to calculate your carbon footprint.</p>
          <a href="/onboarding" className="inline-flex px-6 py-3 gradient-eco text-white font-semibold rounded-xl">
            Start Onboarding
          </a>
        </div>
      </div>
    );
  }

  const breakdown = calculateMonthlyEmissions(user.preferences);
  const totalEmission = calculateTotalEmissions(breakdown);
  const categoryDetails = getCarbonCategoryDetails(user.carbonScore);
  const yearlyEmission = totalEmission * 12;
  const treesNeeded = Math.ceil(yearlyEmission / KG_CO2_PER_TREE_PER_YEAR);
  const equivalentKm = Math.round(yearlyEmission / KG_CO2_PER_KM_CAR);
  const latestReport = MOCK_CARBON_REPORTS[MOCK_CARBON_REPORTS.length - 1];
  const previousReport = MOCK_CARBON_REPORTS[MOCK_CARBON_REPORTS.length - 2];
  const emissionChange = latestReport && previousReport
    ? ((latestReport.totalEmission - previousReport.totalEmission) / previousReport.totalEmission) * 100
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome back, <span className="text-gradient-eco">{user.displayName?.split(' ')[0]}</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">Here&apos;s your sustainability overview</p>
      </motion.div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Monthly Emission',
            value: formatCO2(totalEmission),
            icon: TrendingDown,
            change: emissionChange,
            color: '#22c55e',
          },
          {
            label: 'Eco Points',
            value: formatNumber(user.ecoPoints),
            icon: Leaf,
            change: 15,
            color: '#3b82f6',
          },
          {
            label: 'Green Streak',
            value: `${user.streakDays} days`,
            icon: Flame,
            change: null,
            color: '#f59e0b',
          },
          {
            label: 'Trees Equivalent',
            value: `${treesNeeded} trees/yr`,
            icon: TreePine,
            change: null,
            color: '#22c55e',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card p-5"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={i + 1}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-surface-400 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            {stat.change !== null && (
              <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${
                stat.change <= 0 ? 'text-eco-400' : 'text-red-400'
              }`}>
                {stat.change <= 0 ? (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                {Math.abs(stat.change).toFixed(1)}% vs last month
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carbon Score Card */}
        <motion.div
          className="glass-card-static p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={5}
        >
          <h2 className="text-base font-semibold text-white mb-1">Carbon Score</h2>
          <p className="text-xs text-surface-400 mb-5">Your overall sustainability rating</p>

          <div className="flex flex-col items-center">
            <CarbonScoreRing score={user.carbonScore} size={180} strokeWidth={12} />

            <div className="mt-4 text-center">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: categoryDetails.bgColor,
                  color: categoryDetails.color,
                }}
              >
                {categoryDetails.emoji} {categoryDetails.category}
              </span>
              <p className="text-xs text-surface-400 mt-2 max-w-xs">
                {categoryDetails.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emission Breakdown */}
        <motion.div
          className="glass-card-static p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={6}
        >
          <h2 className="text-base font-semibold text-white mb-1">Emission Breakdown</h2>
          <p className="text-xs text-surface-400 mb-4">Monthly CO₂ by category</p>
          <EmissionPieChart breakdown={breakdown} />
        </motion.div>

        {/* Weekly Goals */}
        <motion.div
          className="glass-card-static p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={7}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Weekly Goals</h2>
              <p className="text-xs text-surface-400">Active challenges</p>
            </div>
            <Target className="w-5 h-5 text-eco-400" />
          </div>

          <div className="space-y-4">
            {MOCK_CHALLENGES.slice(0, 3).map((challenge) => (
              <div key={challenge.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-medium truncate pr-2">{challenge.title}</p>
                  <span className="text-xs text-eco-400 font-semibold shrink-0">
                    {challenge.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-eco"
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span>{formatCO2(challenge.targetCO2Savings)} target</span>
                  <span>{challenge.rewardPoints} pts</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trends */}
        <motion.div
          className="glass-card-static p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={8}
        >
          <h2 className="text-base font-semibold text-white mb-1">Historical Trends</h2>
          <p className="text-xs text-surface-400 mb-4">Your emission trend over 6 months</p>
          <TrendLineChart reports={MOCK_CARBON_REPORTS} />
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          className="glass-card-static p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={9}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">AI Recommendations</h2>
              <p className="text-xs text-surface-400">
                {loadingRecs ? 'Generating recommendations...' : 'Powered by Gemini AI'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {loadingRecs && (
                <RefreshCw className="w-4 h-4 text-eco-400 animate-spin" />
              )}
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          {errorRecs && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
              ⚠️ AI features are temporarily unavailable. Using local recommendations.
            </div>
          )}

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                <p className="text-sm text-surface-300 leading-relaxed">{rec.content}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-eco-400">
                    <Zap className="w-3 h-3" />
                    Save {formatCO2(rec.potentialSavingKg)}/month
                  </span>
                  <span className="text-xs text-surface-500 capitalize">• {rec.category}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Eco Streak & Quick Stats */}
      <motion.div
        className="glass-card-static p-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={10}
      >
        <h2 className="text-base font-semibold text-white mb-4">Eco Streak</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {user.streakDays}
              </p>
              <p className="text-xs text-surface-400">Day Streak</p>
            </div>
          </div>

          <div className="h-12 w-px bg-white/10 hidden sm:block" />

          <div className="flex gap-1">
            {Array.from({ length: 14 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${
                  i < user.streakDays
                    ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30'
                    : 'bg-white/3 text-surface-600 border border-white/5'
                }`}
              >
                {i < user.streakDays ? '✓' : (i + 1)}
              </div>
            ))}
          </div>

          <div className="h-12 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-eco-400" />
            <span className="text-sm text-surface-300">
              {user.streakDays >= 7 ? '🏆 7-Day Streak Achieved!' : `${7 - user.streakDays} more days to badge`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Reduction Opportunities */}
      <motion.div
        className="glass-card-static p-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={11}
      >
        <h2 className="text-base font-semibold text-white mb-1">Reduction Opportunities</h2>
        <p className="text-xs text-surface-400 mb-4">Potential yearly savings through lifestyle changes</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Switch to public transport 2x/week',
              savingMonthly: 12,
              savingYearly: 144,
              icon: '🚌',
              category: 'Transport',
            },
            {
              title: 'Reduce AC by 1 hour daily',
              savingMonthly: 36,
              savingYearly: 432,
              icon: '❄️',
              category: 'Energy',
            },
            {
              title: '2 vegetarian days per week',
              savingMonthly: 25,
              savingYearly: 300,
              icon: '🥗',
              category: 'Food',
            },
          ].map((opp, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-eco-500/5 border border-eco-500/10 hover:border-eco-500/20 transition-colors"
            >
              <div className="text-2xl mb-3">{opp.icon}</div>
              <p className="text-sm font-medium text-white mb-1">{opp.title}</p>
              <p className="text-xs text-surface-400 mb-3">{opp.category}</p>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-eco-400">
                  Save {formatCO2(opp.savingYearly)}/year
                </p>
                <p className="text-xs text-surface-500">
                  ≈ {Math.round(opp.savingYearly / KG_CO2_PER_TREE_PER_YEAR)} trees equivalent
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
