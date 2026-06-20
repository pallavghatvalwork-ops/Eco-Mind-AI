'use client';

// ===========================================
// Carbon Reduction Forecast — ECO MIND AI
// ===========================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown, Calendar, Eye, ShieldCheck, Sparkles,
  TreePine, BarChart3, HelpCircle, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_FORECAST_DATA } from '@/lib/mock-data';
import { formatCO2 } from '@/lib/utils/formatters';

// Available long-term eco commits
const COMMITMENTS = [
  { id: 'solar', label: 'Install Rooftop Solar ☀️', impact: 85, desc: 'Offset ~85kg CO₂/mo by generating clean solar electricity.' },
  { id: 'ev', label: 'Switch to Electric Vehicle ⚡', impact: 65, desc: 'Cut ~65kg CO₂/mo by eliminating internal combustion emissions.' },
  { id: 'vegan', label: 'Adopt Vegan Diet 🥗', impact: 35, desc: 'Save ~35kg CO₂/mo compared to meat-heavy or mixed diets.' },
  { id: 'recycle', label: 'Zero Waste Lifestyle ♻️', impact: 20, desc: 'Save ~20kg CO₂/mo via comprehensive sorting and composting.' },
];

export default function ForecastPage() {
  const { user } = useAuth();
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);

  const handleCommitToggle = (id: string) => {
    if (selectedCommits.includes(id)) {
      setSelectedCommits(selectedCommits.filter(c => c !== id));
    } else {
      setSelectedCommits([...selectedCommits, id]);
    }
  };

  // Compute dynamic forecast data points based on toggled commits
  const adjustedForecast = useMemo(() => {
    const monthlySaving = COMMITMENTS
      .filter(c => selectedCommits.includes(c.id))
      .reduce((sum, c) => sum + c.impact, 0);

    return MOCK_FORECAST_DATA.map((pt, index) => {
      // Savings compound gradually month over month as commits are implemented
      const compoundFactor = Math.min(1, (index + 1) / 4); // Full implementation by month 4
      const currentSaved = monthlySaving * compoundFactor;

      const projected = Math.max(20, pt.projectedTrend - currentSaved);
      const savings = Math.max(10, pt.potentialSavings - currentSaved * 1.2);

      return {
        month: pt.month,
        'Current Trend': pt.currentTrend,
        'Projected Trend (With Goals)': Math.round(projected * 100) / 100,
        'Maximum Savings': Math.round(savings * 100) / 100,
      };
    });
  }, [selectedCommits]);

  // Compute summary values
  const currentEmissions = MOCK_FORECAST_DATA[0].currentTrend;
  const targetEmissions = adjustedForecast[adjustedForecast.length - 1]['Projected Trend (With Goals)'];
  const totalReduction = currentEmissions - targetEmissions;
  const reductionPercentage = ((currentEmissions - targetEmissions) / currentEmissions) * 100;
  const treesSavedEquivalent = Math.ceil((totalReduction * 12) / 22); // 22kg CO2 per tree per year

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-display)] flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-eco-400" />
          Carbon Reduction <span className="text-gradient-eco">Forecast</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Plan ahead: visual 12-month projections showing impact trajectories and green commitments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Forecast Graph Panel (8 columns) */}
        <div className="lg:col-span-8 glass-card-static p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">12-Month Projection</h2>
              <p className="text-xs text-surface-400">Emissions trajectory (kg CO₂ / month)</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/5 text-xs text-surface-300">
              <Calendar className="w-3.5 h-3.5 text-eco-400" />
              Forecast Period: 2026 - 2027
            </div>
          </div>

          {/* Chart Wrapper */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={adjustedForecast}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="Current Trend" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCurrent)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Projected Trend (With Goals)" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorProjected)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Maximum Savings" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 p-4 rounded-2xl bg-white/3 border border-white/5 text-xs text-surface-400 leading-normal">
            <Eye className="w-5 h-5 text-blue-400 shrink-0" />
            <p>
              <strong>Forecast Analysis:</strong> The &quot;Current Trend&quot; projection details what emissions look like if you stick to your baseline. Implementing the checklist commits accelerates savings and brings down the trajectory towards the green &quot;Maximum Savings&quot; envelope.
            </p>
          </div>
        </div>

        {/* Right Side: Commitments & Action panel (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Box */}
          <div className="glass-card-static p-6 space-y-5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-eco-500/5 rounded-full blur-2xl -z-10" />
            
            <h2 className="text-sm font-semibold text-white">Estimated 1-Year Impact</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-eco-400 font-[var(--font-display)]">
                  -{reductionPercentage.toFixed(0)}%
                </span>
                <span className="text-xs text-surface-400 mt-1">Reduction achieved</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-surface-400">Total Monthly Saved</p>
                  <p className="text-sm font-bold text-white mt-0.5">{formatCO2(totalReduction)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400">Offset Equivalence</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{treesSavedEquivalent} Trees</p>
                </div>
              </div>
            </div>
          </div>

          {/* Long Term Commitments */}
          <div className="glass-card-static p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Green Commitments</h3>
              <p className="text-xs text-surface-400 mt-0.5">Select commitments to pledge long term</p>
            </div>

            <div className="space-y-3">
              {COMMITMENTS.map((c) => {
                const isSelected = selectedCommits.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCommitToggle(c.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-eco-500/10 border-eco-500/35 text-white'
                        : 'bg-white/3 border-white/5 text-surface-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{c.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-eco-500/20 text-eco-400' : 'bg-white/5 text-surface-400'
                      }`}>
                        -{c.impact} kg/mo
                      </span>
                    </div>
                    <p className="text-[10px] text-surface-500 mt-1.5 leading-normal">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Target Banner */}
          <div className="p-5 rounded-2xl bg-white/3 border border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Net Zero Alignment
            </div>
            <p className="text-[11px] text-surface-400 leading-relaxed">
              India has set a national commitment to reach Net Zero emissions by 2070. Reaching this target requires massive systemic shifts towards solar and EV grids, alongside micro-pledges by individuals. Aligning your household emissions with an annual 30-40% reduction directly aids national carbon goals.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
