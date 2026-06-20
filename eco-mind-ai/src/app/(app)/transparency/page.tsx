'use client';

// ===========================================
// AI Transparency Page — ECO MIND AI
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, FileText, Settings, ShieldCheck, HelpCircle,
  Activity, ArrowRight, Table, Info
} from 'lucide-react';
import { EMISSION_FACTORS } from '@/lib/carbon/factors';

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function TransparencyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-display)] flex items-center gap-2">
          <Brain className="w-6 h-6 text-eco-400" />
          AI & Carbon <span className="text-gradient-eco">Transparency</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Open-box sustainability: understand how our AI engine translates your inputs into verified carbon accounting.
        </p>
      </div>

      {/* Visual AI Pipeline flowchart */}
      <div className="glass-card-static p-6 space-y-6">
        <h2 className="text-base font-semibold text-white">How Our AI Processing Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          
          {/* Step 1 */}
          <div className="col-span-2 p-4 rounded-xl bg-white/3 border border-white/5 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto text-blue-400 font-bold text-sm">1</div>
            <h3 className="text-xs font-bold text-white">Natural Language / File</h3>
            <p className="text-[10px] text-surface-400 leading-relaxed">
              You upload a receipt, power bill, or type: <em>&quot;Today I drove 12km and ate vegetarian&quot;</em>.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-surface-500">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 2 */}
          <div className="col-span-2 p-4 rounded-xl bg-white/3 border border-white/5 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mx-auto text-purple-400 font-bold text-sm">2</div>
            <h3 className="text-xs font-bold text-white">Gemini Analysis</h3>
            <p className="text-[10px] text-surface-400 leading-relaxed">
              Gemini parsing extracts items, quantities, distance parameters, or electrical units from OCR structures.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-surface-500">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 3 */}
          <div className="col-span-2 p-4 rounded-xl bg-white/3 border border-white/5 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400 font-bold text-sm">3</div>
            <h3 className="text-xs font-bold text-white">Factor Mapping</h3>
            <p className="text-[10px] text-surface-400 leading-relaxed">
              Calculations apply certified local carbon factors to outputs, converting usage to total kg CO₂ equivalents.
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Formula Details & Factors Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Carbon accounting formulas */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Settings className="w-4 h-4 text-eco-400" />
              <h2 className="text-sm font-semibold text-white">Carbon Accounting Formulas</h2>
            </div>
            
            <div className="space-y-4 text-xs text-surface-400 leading-relaxed">
              <div>
                <span className="font-semibold text-white block">⚡ Electricity Footprint Formula</span>
                <div className="my-1.5 p-2 px-3 rounded-lg bg-white/3 text-[10px] font-mono text-white">
                  Emissions = Units Consumed (kWh) × Grid Emission Factor (0.82 kg/kWh)
                </div>
                <p>
                  Our electricity calculations are tailored to the Indian Central Electricity Authority (CEA) grid average factor. The factor is coal-heavy compared to hydro/nuclear dominated grids.
                </p>
              </div>

              <div>
                <span className="font-semibold text-white block">🚗 Travel Footprint Formula</span>
                <div className="my-1.5 p-2 px-3 rounded-lg bg-white/3 text-[10px] font-mono text-white">
                  Emissions = Commute Distance (km) / Modes count × Mode Factor × 30 days
                </div>
                <p>
                  Commute emissions split your daily commute distance equally among select primary modes of travel, multiplied by standard passenger emissions factors (e.g., car = 0.21 kg/km, metro = 0.033 kg/km).
                </p>
              </div>

              <div>
                <span className="font-semibold text-white block">🥩 Diet Footprint Formula</span>
                <div className="my-1.5 p-2 px-3 rounded-lg bg-white/3 text-[10px] font-mono text-white">
                  Emissions = Diet Type Factor × 30 days
                </div>
                <p>
                  Daily diet factors capture agricultural greenhouse gas inputs (feed crop, methane, logistics) for food styles: Non-Veg (7.19 kg/day), Vegetarian (3.81 kg/day), Vegan (2.89 kg/day).
                </p>
              </div>
            </div>
          </div>

          {/* Reference Factor Table */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Standardized Emission Factors</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-surface-400">
                <thead className="text-[10px] uppercase font-bold text-surface-500 border-b border-white/5">
                  <tr>
                    <th className="py-2">Category</th>
                    <th className="py-2">Activity Type</th>
                    <th className="py-2 text-right">Factor Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Transport */}
                  <tr>
                    <td className="py-2 font-medium text-white">Transport</td>
                    <td className="py-2">Petrol Car commute</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.transport.car.factor} kg/km</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Transport</td>
                    <td className="py-2">Metro passenger-km</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.transport.metro.factor} kg/km</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Transport</td>
                    <td className="py-2">Domestic flights</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.transport.flight_domestic.factor} kg/km</td>
                  </tr>
                  {/* Energy */}
                  <tr>
                    <td className="py-2 font-medium text-white">Energy</td>
                    <td className="py-2">India Grid Electricity</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.energy.electricity.factor} kg/kWh</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Energy</td>
                    <td className="py-2">AC Unit (per hour run)</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.energy.ac_hourly.factor} kg/hr</td>
                  </tr>
                  {/* Food */}
                  <tr>
                    <td className="py-2 font-medium text-white">Food</td>
                    <td className="py-2">Non-Vegetarian diet</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.food['non-vegetarian'].factor} kg/day</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Food</td>
                    <td className="py-2">Vegan diet</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.food.vegan.factor} kg/day</td>
                  </tr>
                  {/* Shopping */}
                  <tr>
                    <td className="py-2 font-medium text-white">Shopping</td>
                    <td className="py-2">Online order shipping</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.shopping.online_order.factor} kg/order</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Shopping</td>
                    <td className="py-2">Fast Fashion garment</td>
                    <td className="py-2 text-right font-mono text-white">{EMISSION_FACTORS.shopping.fast_fashion.factor} kg/item</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: AI Boundaries & Standards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Boundaries & Confidence */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">AI Safety & Verification</h2>
            </div>

            <div className="space-y-3 text-xs text-surface-400 leading-relaxed">
              <p>
                <strong>Natural Language Extraction:</strong> While Gemini NLP parses inputs accurately, unstructured logs are always parsed under standard confidence thresholds. You can inspect confidence tags on every parsed block before hitting Save.
              </p>
              <p>
                <strong>Optical Character Recognition (OCR):</strong> Receipt scanning extracts purchased products and references them with typical carbon categories. Where specific item weights are unavailable, typical packaging averages are used.
              </p>
              <p>
                <strong>Calculators validation:</strong> All mathematical calculators run client-side on open equations, preventing algorithmic bias and guaranteeing that you see the exact values driving reports.
              </p>
              <div className="p-3 rounded-lg bg-eco-500/5 border border-eco-500/10 mt-2">
                <p className="text-[11px] text-white font-semibold mb-1">💡 Technical Decision</p>
                <p className="text-[10px] leading-relaxed text-surface-300">
                  To remain compatible with Firebase Spark (free tier), uploaded images are processed in-memory and sent directly to Gemini Vision. No user images are persistently stored. This improves privacy and reduces infrastructure requirements while preserving full AI functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Source citation */}
          <div className="p-5 rounded-2xl bg-white/3 border border-white/5 space-y-3 text-xs text-surface-400">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Info className="w-4 h-4 text-blue-400" />
              Primary Citations
            </div>
            
            <ul className="space-y-2 list-disc pl-4">
              <li>
                <strong>CEA India:</strong> Grid emission factor retrieved from the Central Electricity Authority (CO2 Baseline Database for Indian Power Sector, v18).
              </li>
              <li>
                <strong>IPCC Guidelines:</strong> 2006 IPCC Guidelines for National Greenhouse Gas Inventories applied to fuel combustions and air flights.
              </li>
              <li>
                <strong>India EPA & WRI:</strong> World Resources Institute (WRI) transport factors adjusted for typical vehicle fuel efficiencies in India.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
